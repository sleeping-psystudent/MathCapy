document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get("latest_latex", (data) => {
      document.getElementById("output").value = data.latest_latex || "No result yet.";
    });
  
    document.getElementById("copy").addEventListener("click", () => {
      const text = document.getElementById("output").value;
      navigator.clipboard.writeText(text).then(() => {
        alert("✅ Copied to clipboard!");
      });
    });
  });
  