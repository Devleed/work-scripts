const ethers = require('ethers');
const keccak256 = require('keccak256');

let ABI = ['function setAddr(bytes32 node, uint256 coinType, bytes memory a)'];

const ETH_NODE =
  '0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae';
const COIN_TYPE = 60;

const name = 'hopetalia';
const label = keccak256(name);

const a = '0x59506Cf5C9A9D7DB030DfCEbca82ACb45b741CCc';

const nodehash = keccak256(
  ethers.utils.solidityPack(['bytes32', 'bytes32'], [ETH_NODE, label]),
);

console.log('node hash   ', nodehash.toString('hex'));

const ethersInterface = new ethers.utils.Interface(ABI);
const data = ethersInterface.encodeFunctionData('setAddr', [
  nodehash,
  COIN_TYPE,
  a,
]);

const secret = keccak256(
  ethers.utils.solidityPack(['bytes', 'bytes32'], [a, label]),
).toString('hex');

console.log('data    ', data);
console.log('secret    ', secret);

// function setAddr(
//         bytes32 node,
//         uint256 coinType,
//         bytes memory a
//     ) public virtual authorised(node) {
//         emit AddressChanged(node, coinType, a);
//         if (coinType == COIN_TYPE_ETH) {
//             emit AddrChanged(node, bytesToAddress(a));
//         }
//         versionable_addresses[recordVersions[node]][node][coinType] = a;
//     }
