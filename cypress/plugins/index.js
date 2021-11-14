const axios = require('axios').default;

module.exports = (on, config) => {
  on('task', {
    async fetchData({ url }) {
      try {
        const response = await axios.get(url);

        return JSON.parse(JSON.stringify(response.data));
      } catch (e) {
        console.log(e);
      }
    }
  });

  on('before:browser:launch', (browser = {}, launchOptions) => {
    // `args` is an array of all the arguments that will
    // be passed to browsers when it launches
    console.log(launchOptions.args) // print all current args

    if (browser.family === 'chromium' && browser.name !== 'electron') {
      // auto open devtools
      launchOptions.args.push('--auto-open-devtools-for-tabs')
      launchOptions.args.push('-devtools')
    }

    if (browser.name === 'electron') {
      // auto open devtools
      launchOptions.preferences.devTools = true
    }

    // whatever you return here becomes the launchOptions
    return launchOptions
  })

}