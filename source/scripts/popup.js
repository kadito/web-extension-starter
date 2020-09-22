import 'emoji-log';
import browser from 'webextension-polyfill';
import fetch from 'node-fetch';

document.addEventListener('DOMContentLoaded', async () => {
  // console.log('START');
  let JWT = null;

  await browser.storage.local.get('token').then(({token}) => {
    JWT = token;
  });

  // Already Login
  if (JWT) {
    document.getElementById('login-form').classList.add('hidden');

    document.getElementById('login-success').classList.remove('hidden');
    document.getElementById('login-success').classList.add('flex');
  }

  // Login method!
  document.getElementById('login-submit').addEventListener('click', () => {
    const form = {};

    // Get values from the inputs of form
    form.username = document.getElementById('username').value;
    form.password = document.getElementById('password').value;

    if (form.username && form.password) {
      const query = JSON.stringify({
        query: `query { authorizationToken(username:"${form.username}", password:"${form.password}") }`,
      });

      // Login requets
      fetch('http://localhost:8080/', {
        method: 'POST',
        body: query,
        headers: {
          'content-Type': 'application/json',
        },
      })
        .then(async (response) => {
          const json = await response.json();

          // Handle bad authentication
          if (json.errors) {
            document.getElementById('login-error').classList.remove('hidden');
            document.getElementById('login-error').classList.add('flex');
          }

          // All good and we receive a valid token
          if (json.data.authorizationToken) {
            document.getElementById('login-form').classList.add('hidden');
            document.getElementById('login-error').classList.remove('flex');
            document.getElementById('login-error').classList.add('hidden');

            document.getElementById('login-success').classList.remove('hidden');
            document.getElementById('login-success').classList.add('flex');

            // Save token on browser storage
            browser.storage.local.set({
              token: json.data.authorizationToken.token,
            });
          }
        })
        .catch((err) => {});
    }
  });
});
