console.error('loaded')
browser.webNavigation.onCommitted.addListener((evt) => {
  
  if (evt.frameId !== 0) {
    return;
  }
  console.error(evt.url)
  // TODO: check from localstorage first
  fetchFromServiceIfNotCached(evt.url).then(()=>{

  })
  // postData('https://pijjwctkypdkcbvsaupt.functions.supabase.co/Diskussed-backend', { url: evt.url })
  // .then((data) => {
  //   console.error(data);
  //   setBadge(data.length)
  // });
});

function setBadge(discussionCount) {
  let badgeText = ''
  if (discussionCount) {
    badgeText = discussionCount.toString()
  }
  browser.browserAction.setBadgeText(
    { text: badgeText }
  )
}

async function fetchFromServiceIfNotCached(discussedUrl){
  let cacheEntry = await browser.storage.local.get(discussedUrl)
  console.error("cache", cacheEntry)
  if(!Object.keys(cacheEntry).length){
    const data = await postData('https://pijjwctkypdkcbvsaupt.functions.supabase.co/Diskussed-backend', { url: discussedUrl })
      console.error("data fetched", data)
      cacheEntry = {[discussedUrl]: JSON.stringify(data)}
      console.error("cacheEntry", cacheEntry)
      await browser.storage.local.set(cacheEntry)
  }
  setBadge(JSON.parse(cacheEntry[discussedUrl]).length)
}

// browser.tabs.onActivated.addListener(function(handleActivated){
//   console.error(handleActivated)
// })


async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpamp3Y3RreXBka2NidnNhdXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzIxMzczMjQsImV4cCI6MTk4NzcxMzMyNH0.6l6-TIsVaHquK-4hG4_o-tVmteYGP_uLz4j3a-NQLC4'
    },
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });
  return response.json();
}


