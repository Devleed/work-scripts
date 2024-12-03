const { ethers } = require('ethers');
const erc20Abi = require('./erc20Abi.json');
const argv = require('yargs').argv;
require('dotenv').config();

const provider = new ethers.providers.InfuraProvider('goerli');

const seedPhrase = argv.mnemonic; // ! TESTING
const tokenAddress = '0x4cE6Ab1e12249bC6C2A6AD23bA1eDc8096bDD329'; // ! TESTING
const allowanceAmount = '100';
const spender = '0x00Bbf132C91BF979aBc5f87bE0F21A073b8A4F4C'; // ! TESTING

// const wallet = ethers.Wallet.fromMnemonic(seedPhrase).connect(provider);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider); // ! HARDCODED PKEY

const TOKEN = new ethers.Contract(tokenAddress, erc20Abi, provider);

(async () => {
  const tokenDecimals = await TOKEN.decimals();

  const amount = ethers.utils.parseUnits(allowanceAmount, tokenDecimals);

  const tx = await TOKEN.populateTransaction.approve(spender, amount);

  console.log(tx);

  const sentTx = await wallet.sendTransaction(tx);
  const receipt = await sentTx.wait();

  console.log(sentTx);

  if (receipt) return receipt;
  else return 'error';
})();
