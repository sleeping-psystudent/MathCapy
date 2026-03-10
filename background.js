chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "capture") {
      chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
        if (chrome.runtime.lastError || !dataUrl) {
          console.error("截圖失敗：", chrome.runtime.lastError);
          return;
        }
  
        // 把 dataUrl 傳回 content script 處理
        chrome.tabs.sendMessage(sender.tab.id, {
          action: "screenshot_ready",
          dataUrl: dataUrl,
          area: request.area
        });
      });
    }
  });
  