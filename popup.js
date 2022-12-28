browser.tabs
  .query({ currentWindow: true, active: true })
  .then(([currentTab]) => {
    const tbodyRef = document
      .getElementById("discussions")
      .getElementsByTagName("tbody")[0];

    const getCurrentUrlDiscussions = browser.storage.local.get(currentTab.url);
    getCurrentUrlDiscussions.then((results) => {
      const currentUrlResults = results[currentTab.url]
      if(!currentUrlResults){
        return
      }
      const discussionUrls = JSON.parse(currentUrlResults);
      if(discussionUrls.length){
        document.getElementById('no_discussions').innerHTML = ""
      }
      for (let i = 0; i < discussionUrls.length; i++) {
        const newRow = tbodyRef.insertRow();
        const newCell = newRow.insertCell();
        const aTag = document.createElement("a");
        aTag.href = discussionUrls[i].url;
        aTag.innerHTML = discussionUrls[i].url;
        newCell.appendChild(aTag);
      }
    });
  });
