let startX, startY, selectionBox;
let isSelecting = false;
let selectedArea = null;
let isProcessing = false;

// == 框選區域 == //
function createSelectionBox() {
  selectionBox = document.createElement("div");
  selectionBox.style.position = "fixed";
  selectionBox.style.border = "2px dashed #4CAF50";
  selectionBox.style.backgroundColor = "rgba(76, 175, 80, 0.1)";
  selectionBox.style.zIndex = "999999";
  document.body.appendChild(selectionBox);
}

function removeSelectionBox() {
  if (selectionBox) {
    document.body.removeChild(selectionBox);
    selectionBox = null;
    selectedArea = null;
  }
}

document.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
  
    // ✅ 如果已經畫好選取框，這裡是滑鼠點擊畫面其他地方 → 取消框選
    if (!isSelecting && selectedArea) {
      removeSelectionBox();
      return;
    }
  
    // ✅ 否則開始新的框選
    isSelecting = true;
    startX = e.clientX;
    startY = e.clientY;
    createSelectionBox();
  });
  

document.addEventListener("mousemove", (e) => {
  if (!isSelecting || !selectionBox) return;
  const currentX = e.clientX;
  const currentY = e.clientY;
  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);
  const left = Math.min(currentX, startX);
  const top = Math.min(currentY, startY);

  selectionBox.style.left = `${left}px`;
  selectionBox.style.top = `${top}px`;
  selectionBox.style.width = `${width}px`;
  selectionBox.style.height = `${height}px`;
});

document.addEventListener("mouseup", () => {
  if (!isSelecting || !selectionBox) return;
  isSelecting = false;

  selectedArea = {
    left: parseInt(selectionBox.style.left),
    top: parseInt(selectionBox.style.top),
    width: parseInt(selectionBox.style.width),
    height: parseInt(selectionBox.style.height)
  };

  console.log("選取區域：", selectedArea);
  // ✅ 綠框不自動消失
});

// == 快捷鍵觸發截圖與移除框框 == //
document.addEventListener("keydown", (e) => {
    // ✅ Ctrl + C 辨識 + 移除框框
    if (e.ctrlKey && e.key.toLowerCase() === "c") {
      if (!selectedArea) {
        alert("請先框選一個區域！");
        return;
      }
  
      chrome.runtime.sendMessage({ action: "capture", area: selectedArea });
      removeSelectionBox();
      return;
    }
  
    // ✅ 若按的是純修飾鍵（Ctrl / Shift / Alt / Meta）→ 不處理
    const modifierKeys = ["Control", "Shift", "Alt", "Meta"];
    if (modifierKeys.includes(e.key)) return;
  
    // ✅ 其他鍵 → 移除框框
    if (selectedArea) {
      removeSelectionBox();
    }
  });
  

// == 接收來自 background.js 的截圖結果 == //
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "screenshot_ready") {
    const { dataUrl, area } = message;
    cropImage(dataUrl, area).then((croppedDataUrl) => {
      const base64 = croppedDataUrl.replace(/^data:image\/(png|jpeg);base64,/, "");
      sendToMathpixOCR(base64);
    });
  }
});

// == 圖片裁切處理 == //
function cropImage(dataUrl, area) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = area.width;
      canvas.height = area.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        image,
        area.left, area.top, area.width, area.height,
        0, 0, area.width, area.height
      );
      resolve(canvas.toDataURL("image/png"));
    };
    image.src = dataUrl;
  });
}

// == 呼叫 Mathpix OCR API == //
function sendToMathpixOCR(base64Image) {
  if (isProcessing) {
    alert("⏳ 正在辨識中，請稍候再試！");
    return;
  }

  isProcessing = true;

  try {
    chrome.storage.local.get(["app_id", "app_key"], ({ app_id, app_key }) => {
      if (!app_id || !app_key) {
        alert("❌ 請先在設定頁輸入 Mathpix API 憑證！");
        isProcessing = false;
        return;
      }

      const requestId = Date.now();
      console.log(`📤 Sending to Mathpix [${requestId}]`);

      const body = {
        src: "data:image/png;base64," + base64Image,
        formats: ["markdown", "latex_styled", "text"],
        ocr: ["math", "text"]
      };

      fetch("https://api.mathpix.com/v3/text", {
        method: "POST",
        headers: {
          "app_id": app_id,
          "app_key": app_key,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      })
        .then(res => res.json())
        .then(data => {
          isProcessing = false;
          console.log(`📥 Mathpix 回傳 [${requestId}]:`, data);

          if (data.error) {
            alert("❌ Mathpix 錯誤：" + data.error);
            return;
          }

          const result =
            data.markdown?.trim() ||
            data.text?.trim() ||
            data.latex_styled?.trim();

          if (!result) {
            alert("⚠️ 無辨識結果（圖片可能為空或內容不清）");
            chrome.storage.local.set({ latest_latex: "無辨識結果" });
            return;
          }

          chrome.storage.local.set({ latest_latex: result });
          navigator.clipboard.writeText(result).then(() => {
            alert("✅ 辨識結果已複製到剪貼簿！");
          });
        })
        .catch(err => {
          isProcessing = false;
          console.error("❌ API 傳送失敗：", err);
          alert("❌ OCR 發生錯誤，請稍後再試");
        });
    });
  } catch (err) {
    isProcessing = false;
    console.error("❌ 發送錯誤（可能 context 已失效）", err);
    alert("⚠️ 擷取失敗，請重新整理頁面後再試！");
  }
}