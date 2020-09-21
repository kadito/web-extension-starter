import 'emoji-log';
import browser from 'webextension-polyfill';

let JWT = null;
browser.storage.local.get('token').then(({token}) => {
  JWT = token;
});

browser.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    // Only if we have a Token on extension storage
    if (JWT) {
      // Remove Authorization Header
      const index = details.requestHeaders.findIndex(
        (req) => req.name.toLowerCase() === 'authorization'
      );

      if (index !== -1) {
        details.requestHeaders.splice(index, 1);
      }

      details.requestHeaders.push({
        name: 'authorization',
        value: `Bearer ${JWT}`,
      });
    }

    return {requestHeaders: details.requestHeaders};
  },
  {
    urls: ['https://uh09ot7ael.execute-api.eu-west-1.amazonaws.com/Prod/crm'],
  },
  ['blocking', 'requestHeaders']
);
