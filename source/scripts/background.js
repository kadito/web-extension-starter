import 'emoji-log';
import browser from 'webextension-polyfill';


browser.webRequest.onBeforeSendHeaders.addListener(
  async function(details) {
    console.log(details)
    let jwt;
    await browser.storage.local.get('token').then(({token}) => {
      jwt = token;
    })

    // Possible to remove -> CRM don't have authorization Header
    let index = details.requestHeaders.findIndex(req => req.name.toLowerCase() === 'Authorization')
    details.requestHeaders.splice(index, 1);

    details.requestHeaders.push({
      name: "Authorization",
      value: `teste 123`
    })
    
    return {requestHeaders: details.requestHeaders};
  },
  {urls: ["<all_urls>"]},
  ["blocking", "requestHeaders"]
);
