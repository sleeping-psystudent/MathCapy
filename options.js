// 讀取已儲存的憑證
document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["app_id", "app_key"], (data) => {
      document.getElementById("app_id").value = data.app_id || "capylovemath_a006ac_d3c892";
      document.getElementById("app_key").value = data.app_key || "b4edb37d37962075e4fb49ce21df1267816a78bd6afc4f64bb8b6d6fad76daa2";
    });
  });
  
  // 儲存憑證
  document.getElementById("save").addEventListener("click", () => {
    const appId = document.getElementById("app_id").value.trim();
    const appKey = document.getElementById("app_key").value.trim();
  
    chrome.storage.local.set({ app_id: appId, app_key: appKey }, () => {
      document.getElementById("status").textContent = "✅ Settings saved!";
      setTimeout(() => {
        document.getElementById("status").textContent = "";
      }, 2000);
    });
  });
  