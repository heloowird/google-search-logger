import { getMD5 } from "./utils.js";

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url.includes('www.google.com.hk/search')) {
    const queryParams = tab.url.split("?")[1];
    const urlParams = new URLSearchParams(queryParams);
    const queryWord = urlParams.get("q");
    const queryWordMD5 = getMD5(unescape(encodeURIComponent(queryWord)));

    chrome.tabs.sendMessage(tabId, {
      type: "ADD",
      queryWord: queryWord,
      queryWordMD5: queryWordMD5,
      url: tab.url,
    });
  }
});

