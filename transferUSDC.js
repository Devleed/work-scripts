const ethers = require('ethers');
const argv = require('yargs').argv;
const erc20Abi = require('./erc20Abi.json');

/**
 * args required
 * mnemonic
 * to
 * tokenAddress
 * val
 */

console.log(argv);

const seedPhrase = argv.mnemonic; // ! TESTING
const destinationAddress =
  argv.to || '0xC07E5997B19EE9aa569795Cbc477F1C8dB6a42C4'; // ! TESTING;
const tokenAddress =
  argv.tokenAddress || '0x4D6F6B49A69fa6efC476D7Bdc149B31Ca5944210';
const amountToSend = String(argv.val) || '10';

// Connect to the Ethereum mainnet
const provider = new ethers.providers.InfuraProvider('goerli');

// ? Derive the wallet from the seed phrase
// const wallet = ethers.Wallet.fromMnemonic(seedPhrase).connect(provider);
const wallet = new ethers.Wallet(
  '7c45a50238b49fd2d85f9b654cc758b57e4ce9f0ebd2dcd21c4bf97450496436',
  provider,
); // ! HARDCODED PKEY
// const signerWallet = new ethers.Wallet(wallet.privateKey, provider);

// console.log(signerWallet);

async function transferFunds() {
  const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, provider);

  const balance = await tokenContract.balanceOf(wallet.address);
  const decimals = await tokenContract.decimals();

  const amount = ethers.utils.parseUnits(amountToSend, decimals);

  console.log(amount, balance, decimals);

  if (balance.lt(amount)) {
    console.error(`The wallet doesn't have enough funds`);
    return;
  }

  // Build the transfer transaction
  const tx = await tokenContract.populateTransaction.transfer(
    destinationAddress,
    amount,
    {
      gasLimit: 210000,
    },
  );

  console.log(tx);

  const sentTx = await wallet.sendTransaction(tx);
  const receipt = await sentTx.wait();

  console.log(sentTx);

  if (receipt) return receipt;
  else return 'error';
}

transferFunds().then(console.log).catch(console.error);
