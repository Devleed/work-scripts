const { Connection, PublicKey } = require('@solana/web3.js');
const {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} = require('@solana/spl-token');
const axios = require('axios');

// Solana RPC endpoint
const SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com';
// const SOLANA_RPC_URL = 'https://api.devnet.solana.com';
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=';

// Create a connection to the Solana network
const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

// Function to get SOL balance
async function getSolBalance(walletAddress) {
  const publicKey = new PublicKey(walletAddress);
  const balance = await connection.getBalance(publicKey);
  return balance / 1e9; // Convert from lamports to SOL
}

// Function to fetch token prices from CoinGecko API
// async function getTokenPrice(tokenId) {
//   try {
//     const response = await axios.get(
//       `${COINGECKO_API_URL}${tokenId}&vs_currencies=usd`,
//     );
//     if (response.data[tokenId]) {
//       return response.data[tokenId].usd;
//     } else {
//       console.log(`Price for token ${tokenId} not found.`);
//       return 0;
//     }
//   } catch (error) {
//     console.error('Error fetching token price:', error);
//     return 0;
//   }
// }

// Function to get token balances along with names and prices
async function getTokenBalances(walletAddress) {
  const publicKey = new PublicKey(walletAddress);
  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
    publicKey,
    {
      programId: new PublicKey(TOKEN_PROGRAM_ID),
    },
  );

  const tokenBalances = [];
  for (let account of tokenAccounts.value) {
    const tokenAmount = account.account.data.parsed.info.tokenAmount;
    const mintAddress = account.account.data.parsed.info.mint;

    // Token name from the mint address (could be further refined by using metadata APIs)
    // const tokenName = await getTokenName(mintAddress);
    // const tokenPrice = await getTokenPrice(tokenName.toLowerCase());
    tokenBalances.push({
      mint: mintAddress,
      amount: tokenAmount.uiAmount,
      //   name: tokenName,
      //   priceUSD: tokenPrice,
      //   valueUSD: tokenPrice * tokenAmount.uiAmount,
    });
  }

  return tokenBalances;
}

// Function to fetch token name using the token metadata API
async function getTokenName(mintAddress) {
  const mintPublicKey = new PublicKey(mintAddress);
  const metadataPDA = await PublicKey.findProgramAddress(
    [Buffer.from('metadata'), Buffer.from('mint'), mintPublicKey.toBuffer()],
    new PublicKey('metaqbxxUerdq28c7WQd9RuGHFkd7PofgMjFSCCj64o'),
  );

  try {
    const metadataAccount = await connection.getAccountInfo(metadataPDA[0]);
    console.log('🚀 ~ getTokenName ~ metadataAccount:', metadataAccount);
    const metadata = Buffer.from(metadataAccount.data);
    const name = metadata.toString().split('\0')[0]; // Extract the token name
    return name;
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    return 'Unknown Token';
  }
}

// Main function to get user's portfolio with names and prices
async function getSolanaPortfolio(walletAddress) {
  try {
    // Get SOL balance
    const solBalance = await getSolBalance(walletAddress);
    console.log(`SOL Balance: ${solBalance} SOL`);

    // Get token balances with names and prices
    const tokenBalances = await getTokenBalances(walletAddress);
    if (tokenBalances.length > 0) {
      console.log('Token Balances:');
      tokenBalances.forEach(token => {
        console.log(
          `Name: ${token.name}, Mint: ${token.mint}, Amount: ${token.amount}`,
        );
        // console.log(
        //   `Price: $${token.priceUSD.toFixed(
        //     2,
        //   )}, Value: $${token.valueUSD.toFixed(2)}`,
        // );
      });
    } else {
      console.log('No tokens found.');
    }
  } catch (error) {
    console.error('Error fetching portfolio:', error);
  }
}

// Example: Replace with the Solana wallet address you want to check
const walletAddress = 'n26v8iwp3J1k6HwbvrEJm9bHTS1CqtFVwvyQ7C5t7aK';

getSolanaPortfolio(walletAddress);
