console.error("loaded");
const BLACKLIST_URLS = [
  "moz-extension://",
  "about:",
  "https://www.google.com/search",
];

// https://stackoverflow.com/a/11156533/3363206
browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (!changeInfo.url) {
    return;
  }
  console.error("updated!", changeInfo.url);
  const cleanUrl = changeInfo.url.split("?")[0];
  if (shouldCheckForDisccussion(cleanUrl)) {
    fetchFromServiceIfNotCached(window.sha256(cleanUrl)).then(() => {});
  }
});

browser.tabs.onActivated.addListener(function (activeInfo) {
  browser.tabs.get(activeInfo.tabId, function (tab) {
    console.error("activated", tab.url);
    fetchFromServiceIfNotCached(tab.url).then(() => {});
  });
});

function setBadge(discussionCount) {
  let badgeText = "";
  if (discussionCount) {
    badgeText = discussionCount.toString();
  }
  browser.browserAction.setBadgeText({ text: badgeText });
}

async function fetchFromServiceIfNotCached(url) {
  let cacheEntry = await browser.storage.local.get(url);
  console.error("cache", cacheEntry);
  if (!Object.keys(cacheEntry).length) {
    const data = await postData(
      "https://pijjwctkypdkcbvsaupt.functions.supabase.co/Diskussed-backend",
      { hashedUrl: url }
    );
    console.error("data fetched", data);
    cacheEntry = { [url]: JSON.stringify(data) };
    console.error("cacheEntry", cacheEntry);
    await browser.storage.local.set(cacheEntry);
  }
  setBadge(JSON.parse(cacheEntry[url]).length);
}

async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpamp3Y3RreXBka2NidnNhdXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzIxMzczMjQsImV4cCI6MTk4NzcxMzMyNH0.6l6-TIsVaHquK-4hG4_o-tVmteYGP_uLz4j3a-NQLC4",
    },
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });
  return response.json();
}

function shouldCheckForDisccussion(url) {
  // TODO: blacklist should be configurable
  if (BLACKLIST_URLS.some((blacklistedUrl) => url.startsWith(blacklistedUrl))) {
    return false;
  }
  return true;
}
