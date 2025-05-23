import {
  Connection,
  Keypair,
  clusterApiUrl,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  createMint,
  mintTo,
  createAccount,
  createApproveInstruction,
} from '@solana/spl-token';
// Playground wallet
const payer = pg.wallet.keypair;
// Connection to devnet cluster
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
// Authority that can mint new tokens
const mintAuthority = pg.wallet.publicKey;
// Generate new keypair to use as "delegate"
const delegate = new Keypair();
// Create new mint account using `createMint` helper function
const mint1 = await createMint(
  connection,
  payer, // payer
  payer.publicKey, // mint authority
  null, // freeze authority
  2, // decimals
);
// Create another mint account using `createMint` helper function
const mint2 = await createMint(
  connection,
  payer, // payer
  payer.publicKey, // mint authority
  null, // freeze authority
  2, // decimals
);
// Create Token Account for mint1 using `createAccount` helper function
const tokenAccount1 = await createAccount(
  connection,
  payer, // Payer to create Token Account
  mint1, // Mint Account address
  payer.publicKey, // Token Account owner
);
// Create Token Account for mint2 using `createAccount` helper function
const tokenAccount2 = await createAccount(
  connection,
  payer, // Payer to create Token Account
  mint2, // Mint Account address
  payer.publicKey, // Token Account owner
);
// Mint tokens to tokenAccount1 using `mintTo` helper function
await mintTo(
  connection,
  payer, // Transaction fee payer
  mint1, // Mint Account address
  tokenAccount1, // Mint to
  mintAuthority, // Mint Authority address
  100, // Amount
);
// Mint tokens to tokenAccount2 using `mintTo` helper function
await mintTo(
  connection,
  payer, // Transaction fee payer
  mint2, // Mint Account address
  tokenAccount2, // Mint to
  mintAuthority, // Mint Authority address
  100, // Amount
);
const approveInstruction1 = createApproveInstruction(
  tokenAccount1, // Token Account
  delegate.publicKey, // Approved delegate
  payer.publicKey, // Token Account owner
  100, // Approved amount
);
const approveInstruction2 = createApproveInstruction(
  tokenAccount2, // Token Account
  delegate.publicKey, // Approved delegate
  payer.publicKey, // Token Account owner
  100, // Approved amount
);
const transaction = new Transaction().add(
  approveInstruction1,
  approveInstruction2,
);
const transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [payer], // Signer
);
console.log(
  '\nApprove Delegate:',
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
