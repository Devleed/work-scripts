const fs = require('fs');
const axios = require('axios');
const solc = require('solc');

const API_URL = 'https://api-sepolia.etherscan.io/api';
const API_KEY = 'YYUUJDZYDFRD9GED2ZRBZ6JBPCZK5V433R';

(async () => {
  const contractAddress = '0x57fC2e38548F1aa324BD2fBFB55d407b87b5fcC9'; // Replace with your deployed contract address
  const sourceCode = fs.readFileSync('./contracts/contract1.sol', 'utf8');

  const compilerVersion = 'v0.8.28+commit.7893614a';

  const params = {
    apikey: API_KEY, // Replace with your actual API key
    module: 'contract',
    action: 'verifysourcecode',
    contractaddress: contractAddress, // Replace with your contract address
    sourceCode: sourceCode, // Replace with your source code
    codeformat: 'solidity-single-file',
    contractname: 'Storage', // Replace with your contract name
    compilerversion: compilerVersion, // Your compiler version
    optimizationUsed: 0,
    chainId: 11155111,
  };

  const queryParams = new URLSearchParams(params);

  try {
    console.log('Submitting verification request...');
    const response = await axios.post(API_URL, queryParams);
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error verifying contract:', error);
  }
})();
