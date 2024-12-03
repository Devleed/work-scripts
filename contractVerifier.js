const fs = require('fs');
const axios = require('axios');
const solc = require('solc');

const API_URL = 'https://api-sepolia.etherscan.io/api';
const API_KEY = 'YYUUJDZYDFRD9GED2ZRBZ6JBPCZK5V433R';

console.log('Solc compiler version: ', solc.version());

(async () => {
  const contractAddress = '0xDc4dF40c1D49E05958a1A124fa1F808435Ea1fCb'; // Replace with your deployed contract address
  const sourceCode = fs.readFileSync('./contracts/contract1.sol', 'utf8'); // Path to your Solidity file
  const compilerVersion = encodeURIComponent('v0.8.28+commit.7893614a');

  const params = {
    apikey: API_KEY, // Replace with your actual API key
    module: 'contract',
    action: 'verifysourcecode',
    contractaddress: contractAddress, // Replace with your contract address
    sourceCode: sourceCode, // Replace with your source code
    codeformat: 'solidity-single-file',
    contractname: 'Storage', // Replace with your contract name
    compilerversion: compilerVersion, // Your compiler version
    optimizationUsed: 1,
    runs: 200,
  };

  // Convert object to query string
  const queryParams = new URLSearchParams(params).toString();

  console.log(queryParams);

  try {
    console.log('Submitting verification request...');
    const response = await axios.post(`${API_URL}?${queryParams}`, params);
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error verifying contract:', error);
  }
})();
