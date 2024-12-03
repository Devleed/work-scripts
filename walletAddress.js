const ethers = require('ethers');
const argv = require('yargs').argv;

const mnemonic = argv.mnemonic;
console.log('🚀 ~ file: walletAddress.js:5 ~ mnemonic:', mnemonic);
const wallet = ethers.Wallet.fromMnemonic(mnemonic);
const address = wallet.address;

console.log('Address: ', address);
