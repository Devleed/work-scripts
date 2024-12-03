const { ethers } = require('ethers');
require('dotenv').config();

// Contract ABI
const CONTRACT_ABI = [
  {
    inputs: [],
    name: 'retrieve',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'num',
        type: 'uint256',
      },
    ],
    name: 'store',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

// Contract address from .env
const CONTRACT_ADDRESS = '0x1587E069e3F332b1a1c5FbC36eDDb45DB45da988';

// Provider and Wallet
const provider = new ethers.providers.JsonRpcProvider(
  'https://sepolia.infura.io/v3/b6bb6f5b350d48dcbf5006eb54d85010',
);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Contract Instance
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

// Functions to interact with the contract
async function retrieveValue() {
  try {
    const value = await contract.retrieve();
    console.debug(`Stored Value: ${value.toString()}`);
  } catch (error) {
    console.error('Error retrieving value:', error);
  }
}

async function storeValue(num) {
  try {
    console.debug(`Storing Value: ${num}...`);
    const tx = await contract.store(num);
    console.debug('Transaction sent. Waiting for confirmation...');

    const receipt = await tx.wait();
    console.debug('Transaction confirmed. Receipt:', receipt);
  } catch (error) {
    console.error('Error storing value:', error);
  }
}

// Main Execution
(async () => {
  console.log('Interacting with the contract...');

  await retrieveValue();
  await storeValue(12);
  await retrieveValue();
})();
