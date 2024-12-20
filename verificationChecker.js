const axios = require('axios');

const API_URL = 'https://api-sepolia.etherscan.io/api';

const checkStatus = async () => {
  const guid = 'c6vnstktqx7fznekdac7wvwbs4f3ttep6bfs3kes5j2lv1yhqe'; // Replace with the GUID returned from verification
  const apiKey = 'YYUUJDZYDFRD9GED2ZRBZ6JBPCZK5V433R';

  try {
    const response = await axios.get(API_URL, {
      params: {
        apikey: apiKey,
        module: 'contract',
        action: 'checkverifystatus',
        guid: guid,
      },
    });
    console.log('Verification Status:', response.data);
  } catch (error) {
    console.error('Error checking verification status:', error.message);
  }
};

checkStatus();
