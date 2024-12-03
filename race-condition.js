const axios = require('axios');

const url1 = 'http://localhost:3999/user/claim/john';
const url2 = 'http://localhost:4999/user/claim/john';

(async () => {
  try {
    const [res1, res2] = await Promise.all([axios.get(url1), axios.get(url2)]);

    console.log('resses  ', res1?.data, res2?.data);
  } catch (e) {
    console.log('error', e.response.data);
  }
})();
