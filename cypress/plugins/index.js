const axios = require('axios').default;

module.exports = (on, config) => {
  on('task', {
    async fetchData({ url }) {
      try {
        const response = await axios.get(url);

        return JSON.parse(JSON.stringify(response.data));
      } catch (err) {
        console.error(err);
      }
    },
  })
}