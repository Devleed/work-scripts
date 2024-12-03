const fs = require('fs');
const solc = require('solc');
const { ethers } = require('ethers');
require('dotenv').config();

const provider = new ethers.providers.JsonRpcProvider(
  'https://sepolia.infura.io/v3/b6bb6f5b350d48dcbf5006eb54d85010',
);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

(async () => {
  try {
    const filePath = 'contracts/contract1.sol';
    const source = fs.readFileSync(filePath, 'utf8');
    console.debug('🚀 ~ source:', source);

    // Compiler input configuration with OpenZeppelin import resolver
    const input = {
      language: 'Solidity',
      sources: {
        'Contract.sol': {
          content: source,
        },
      },
      settings: {
        outputSelection: {
          '*': {
            '*': ['abi', 'evm.bytecode'],
          },
        },
      },
    };

    // Custom import resolver for OpenZeppelin contracts
    function findImports(path) {
      console.debug('🚀 ~ findImports ~ path:', path);
      try {
        if (path.startsWith('@openzeppelin')) {
          return {
            contents: fs.readFileSync(`node_modules/${path}`, 'utf8'),
          };
        }
        return { error: 'File not found' };
      } catch (err) {
        console.error('🚀 ~ findImports ~ err:', err);
        return { error: err.message };
      }
    }

    // Compile contract with import resolver
    const output = JSON.parse(
      solc.compile(JSON.stringify(input), { import: findImports }),
    );
    console.debug('🚀 ~ solc -> output:', source);
    console.log('solc deployed contract');

    // Check for compilation errors
    if (output.errors) {
      console.error('output errors -> ', output.errors);
    }

    const contractName = Object.keys(output.contracts['Contract.sol'])[0];
    console.debug('🚀 ~ contractName:', contractName);

    const { abi, evm } = output.contracts['Contract.sol'][contractName];
    const bytecode = evm.bytecode.object;

    // Deploy contract
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    const gasLimit = 3000000; // Set a manual gas limit (adjust if needed)
    const contract = await factory.deploy({ gasLimit });

    console.debug('🚀 ~ contract:', contract);

    // // Wait for deployment to finish
    // await contract.deployTransaction().wait();

    // console.table({
    //   address: contract.target,
    //   transactionHash: contract.deployTransaction().hash,
    // });
  } catch (error) {
    console.error('general error -> ', error);
  }
})();
