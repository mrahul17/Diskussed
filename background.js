console.error('loaded')
browser.webNavigation.onCommitted.addListener((evt) => {
  
  if (evt.frameId !== 0) {
    return;
  }
  console.error(evt.url)
});

