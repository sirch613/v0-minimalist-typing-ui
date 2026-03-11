// Forward Command+J shortcut to the active tab's content script
chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-sirch") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "toggle-sirch" });
      }
    });
  }
});
