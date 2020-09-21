import 'emoji-log';
import browser from 'webextension-polyfill';
import fetch from 'node-fetch';

let JWT = null;
browser.storage.local.get('token').then(({token}) => {
  JWT = token;
});

document.addEventListener('DOMContentLoaded', () => {
  // console.log('START');

  // Already Login
  if (JWT) {
    document.getElementById('login-form').classList.add('hidden');

    document.getElementById('login-success').classList.remove('hidden');
    document.getElementById('login-success').classList.add('flex');
  }

  // Login method!
  document.getElementById('login-submit').addEventListener('click', () => {
    const form = {};

    form.username = document.getElementById('username').value;
    form.password = document.getElementById('password').value;

    if (form.username && form.password) {
      const query = JSON.stringify({
        query: `query { authorizationToken(username:"${form.username}", password:"${form.password}") }`,
      });

      fetch('http://localhost:8080/', {
        method: 'POST',
        body: query,
        headers: {
          'content-Type': 'application/json',
        },
      }).then(async (response) => {
        const json = await response.json();
        if (json.data.authorizationToken) {
          document.getElementById('login-form').classList.add('hidden');

          document.getElementById('login-success').classList.remove('hidden');
          document.getElementById('login-success').classList.add('flex');

          browser.storage.local.set({
            token: json.data.authorizationToken.token,
          });
        }
        // Handle wrong credentials
      });
    }
  });
});
