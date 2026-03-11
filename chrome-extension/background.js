// Omnibox: type "sirch <query>" in the address bar
chrome.omnibox.onInputEntered.addListener((text) => {
  const query = text.trim()
  if (query) {
    chrome.tabs.update({ url: `https://sirch.ai/?q=${encodeURIComponent(query)}` })
  } else {
    chrome.tabs.update({ url: "https://sirch.ai" })
  }
})

chrome.omnibox.setDefaultSuggestion({
  description: "Search with Sirch AI: %s"
})
