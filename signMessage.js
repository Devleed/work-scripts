const { ethers } = require('ethers');
require('dotenv').config();

let privateKey = process.env.PRIVATE_KEY;
let address = '0xA56Ac291F7dEaA2EB0a80021F307E6a994F2d4ee';
let nonce = '4de6800cdc6e438b91dfdc468b355dcc'; // ! create this using createNonce mutation, this will change on every call
let wallet = new ethers.Wallet(privateKey);

let message = `dev.spaace.avicenne.dev wants you to sign in with your Ethereum account:\n${address}\n\nHello from Spaace!\nBy signing this message, you are proving your Web3 identity in order to sign in.\nYou also accept our Privacy Policy and Terms of Use.\n\nURI: https://dev.spaace.avicenne.dev\nVersion: 1\nChain ID: 5\nNonce: ${nonce}\nIssued At: 2024-02-17T13:06:31.306Z`;

wallet.signMessage(message).then(sign => {
  console.log(sign);
});
