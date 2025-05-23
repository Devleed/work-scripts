import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  Liquidity,
  LIQUIDITY_STATE_LAYOUT_V4,
  Percent,
  Token,
  TokenAmount,
  TxVersion,
  LiquidityPoolKeysV4,
} from '@raydium-io/raydium-sdk';
import { Wallet } from '@project-serum/anchor';
const bs58 = require('bs58');
const { getOrCreateAssociatedTokenAccount } = require('@solana/spl-token');

const poolKeys: any = {
  id: new PublicKey('9xXxH7RKjZvN5dB16n6FKDG9ApU9pPaBrHGrJS7sotJo'), // poolState
  baseMint: new PublicKey('So11111111111111111111111111111111111111112'), // token0 (SOL)
  quoteMint: new PublicKey('rhKCaw7w3suVsj3ps2BTvN2PFRuMCAEGSzDmYiSAaeW'), // token1
  lpMint: new PublicKey('hfbVxzBBjecdRazWyZxwZK2nPp5SsMFj9NMbRvxFtLY'),
  baseDecimals: 9, // SOL decimals
  quoteDecimals: 9, // Replace with your token's decimals
  lpDecimals: 9, // Typically same as pool decimals
  version: 4,
  programId: new PublicKey('CPMDWBwJDtYax9qW7AyRuVC19Cc4L4Vcy4n2BHAbHkCW'), // cpSwapProgram
  authority: new PublicKey('7rQ1QFNosMkUCuh7Z7fPbTHvh73b68sQYdirycEzJVuw'),
  baseVault: new PublicKey('5Lfbw17wq7AjJ9MikcNYRVGnZga7jaaiqjNY9Qzosm9R'), // token0Vault
  quoteVault: new PublicKey('3diyDWYAGXVXYS2uShkfGA5oPMDWFcmCDabB9bcByVvv'), // token1Vault
  lpVault: new PublicKey('Adbq7RTyPKuNd6xEsCjVa3LUY55DrW648nEg6PKmk2N6'), // vaultTokenAccount
};

// Configuration - DEVNET
const RPC_ENDPOINT = 'https://api.devnet.solana.com';
const connection = new Connection(RPC_ENDPOINT);

const TOKEN_PROGRAM_ID = new PublicKey(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
);

// Replace with your wallet's private key (base58 encoded)
const WALLET_PRIVATE_KEY =
  '5RVmj2xDszpuM9Wjj1RwNiaf9De3Nb1vKJLBm6YHwngQrp3T5U2G16LYKeHobdXQRhZ623TkxCxr3LtuhgYVvE5N';
const walletKeypair = Keypair.fromSecretKey(
  bs58.default.decode(WALLET_PRIVATE_KEY),
);
const wallet = new Wallet(walletKeypair);

// Replace these with your custom token details
const TOKEN_A = new Token(
  TOKEN_PROGRAM_ID, // Program ID
  new PublicKey('So11111111111111111111111111111111111111112'), // Token mint address
  9, // Decimals
);

const TOKEN_B = new Token(
  TOKEN_PROGRAM_ID, // Program ID
  new PublicKey('rhKCaw7w3suVsj3ps2BTvN2PFRuMCAEGSzDmYiSAaeW'), // Token mint address
  9, // Decimals
);

async function getPoolInfo(): Promise<any> {
  // return await Liquidity.fetc
  return await Liquidity.fetchInfo({
    connection,
    poolKeys,
  });
}

async function swapTokens() {
  try {
    console.log('Fetching pool info...');

    // Define swap parameters (swap 10 TOKA to TOKB)
    const amountIn = new TokenAmount(TOKEN_A, 1 * 10 ** TOKEN_A.decimals); // 10 TOKA
    const minimumAmountOut = new TokenAmount(
      TOKEN_B,
      80000 * 10 ** TOKEN_B.decimals,
    ); // Accept any amount out

    console.log('Building swap transaction...');

    // Liquidity.computeAmountOut({
    //   poolKeys,
    //   amountIn,
    //   currencyOut: TOKEN_B,
    //   slippage,
    // })

    const token0Account = await getOrCreateAssociatedTokenAccount(
      connection,
      walletKeypair,
      TOKEN_A.mint,
      wallet.publicKey,
    );
    const token1Account = await getOrCreateAssociatedTokenAccount(
      connection,
      walletKeypair,
      TOKEN_B.mint,
      wallet.publicKey,
    );

    const { address, innerTransactions } =
      await Liquidity.makeSwapInstructionSimple({
        connection,
        poolKeys,
        userKeys: {
          owner: wallet.publicKey,
          tokenAccounts: [
            {
              pubkey: token0Account.address,
              accountInfo: token0Account as any,
              programId: TOKEN_PROGRAM_ID,
            },
            {
              pubkey: token1Account.address,
              accountInfo: token1Account as any,
              programId: TOKEN_PROGRAM_ID,
            },
          ],
        },
        amountIn,
        amountOut: minimumAmountOut,
        fixedSide: 'in',
        makeTxVersion: TxVersion.V0,
      });

    // const { transaction, signers } = await Liquidity.makeSwapInstructionSimple({
    //   connection,
    //   poolKeys,
    //   userKeys: {
    //     owner: wallet.publicKey,
    //     payer: wallet.publicKey,
    //   },
    //   amountIn,
    //   amountOut: minimumAmountOut,
    //   fixedSide: 'in', // Fixed input amount
    //   makeTxVersion: TxVersion.V0,
    //   slippage: new Percent(5, 100), // 5% slippage tolerance for devnet
    // });

    console.log('Sending transaction...');

    for (let innerTx of innerTransactions) {
      const transaction = new Transaction();
      transaction.add(...innerTx.instructions);

      const signers = [walletKeypair, ...innerTx.signers];

      const txid = await sendAndConfirmTransaction(
        connection,
        transaction,
        signers,
        {
          skipPreflight: true,
          commitment: 'confirmed',
        },
      );

      console.log(`Swap executed successfully! Txid: ${txid}`);
      console.log(
        `View on Solana Explorer: https://explorer.solana.com/tx/${txid}?cluster=devnet`,
      );
    }
  } catch (error) {
    console.error('Error swapping tokens:', error);
  }
}

// async function airdropSol(amount: number = 1) {
//   try {
//     console.log(`Requesting airdrop of ${amount} SOL...`);
//     const signature = await connection.requestAirdrop(
//       wallet.publicKey,
//       amount * 1e9,
//     );
//     await connection.confirmTransaction(signature);
//     console.log(`Airdrop successful! Signature: ${signature}`);
//   } catch (error) {
//     console.error('Error during airdrop:', error);
//   }
// }

// Uncomment the function you want to execute
// airdropSol(1); // Get some devnet SOL first
// createPool(); // You'll need to create pool first (or get existing pool ID)
// addLiquidity();
swapTokens();

// getPoolInfo().then(console.log);
