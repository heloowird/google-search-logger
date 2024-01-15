(() => {
  const fetchSearchLog = () => {
    return new Promise((resolve) => {
      chrome.storage.local.get(["searchLog"], (obj) => {
        resolve(obj["searchLog"] ? JSON.parse(obj["searchLog"]) : []);
      });
    });
  };
  
  const addSearchLog = async (currentQueryWord, currentQueryWordMD5, currentQueryURL) => {
    const query = {
      word: currentQueryWord,
      md5: currentQueryWordMD5,
      url: currentQueryURL,
    };
    console.log(JSON.stringify(query));
      
    currentSearchLog = await fetchSearchLog();
    console.log("before add:" + JSON.stringify(currentSearchLog));
    const queryExist = currentSearchLog.find((obj) => obj.md5 === query.md5); 
    if (!queryExist) {
      chrome.storage.local.set({
        ["searchLog"]: JSON.stringify([...currentSearchLog, query])
      });
    }
  };
  
  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, queryWord, queryWordMD5, url } = obj;

    if (type === "ADD") {
      addSearchLog(queryWord, queryWordMD5, url);
    }
  });
})();

