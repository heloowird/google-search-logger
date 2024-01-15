const onDelete = async e => {
  const curQueryWordMD5 = e.target.parentNode.parentNode.getAttribute("query-md5");
  const searchLogElementToDelete = document.getElementById(
    "search-log-" + curQueryWordMD5
  );

  searchLogElementToDelete.parentNode.removeChild(searchLogElementToDelete);

  let data = await chrome.storage.local.get(["searchLog"]);
  let searchLogs = data["searchLog"] ? JSON.parse(data["searchLog"]) : [];
  console.log("before del:" + JSON.stringify(searchLogs));
  searchLogs = searchLogs.filter((b) => b.md5 != curQueryWordMD5);
  console.log("after del:" + JSON.stringify(searchLogs));
  chrome.storage.local.set({ ["searchLog"]: JSON.stringify(searchLogs) });
};

const setSearchHistoryAttr =  async (src, eventListener, controlParentElement) => {
  const controlElement = document.createElement("img");

  controlElement.src = "images/" + src + ".png";
  controlElement.title = src;
  controlElement.addEventListener("click", eventListener);
  controlParentElement.appendChild(controlElement);
};

const addSearchHistory = async (searchLogsElement, searchLog) => {
  const searchHistoryTagElement = document.createElement("a");
  const searchHistoryTitleElement = document.createElement("div");
  const searchHistoryControlElement = document.createElement("div");
  const newSearchHistoryElement = document.createElement("div");

  searchHistoryTagElement.textContent = searchLog.word;
  searchHistoryTagElement.href = searchLog.url;
  searchHistoryTagElement.target="_blank";
  searchHistoryTitleElement.className = "search-log-title";
  searchHistoryTitleElement.appendChild(searchHistoryTagElement);

  searchHistoryControlElement.className = "search-log-control";

  setSearchHistoryAttr("delete", onDelete, searchHistoryControlElement);

  newSearchHistoryElement.id  = "search-log-" + searchLog.md5;
  newSearchHistoryElement.className  = "search-log";
  newSearchHistoryElement.setAttribute("query-md5", searchLog.md5);
  newSearchHistoryElement.appendChild(searchHistoryTitleElement);
  newSearchHistoryElement.appendChild(searchHistoryControlElement);

  searchLogsElement.appendChild(newSearchHistoryElement);
};

const viewSearchHistory = async (currentSearchLogs=[]) => {
  const searchLogsElement = document.getElementById('all-search-history');
  if (currentSearchLogs.length > 0) {
    for (let i = 0; i < currentSearchLogs.length; i++) {
      const searchLog = currentSearchLogs[i];
      addSearchHistory(searchLogsElement, searchLog);
    }
  } else {
    searchLogsElement.innerHTML = '<i class="row">No Search history to show</i>';
  }
  return;
};

document.addEventListener('DOMContentLoaded', async () => {
  chrome.storage.local.get(["searchLog"], (result) => {
    const searchLogs = result["searchLog"] ? JSON.parse(result["searchLog"]) : [];
    console.log("view: " + JSON.stringify(searchLogs));
    viewSearchHistory(searchLogs);
  });
});

