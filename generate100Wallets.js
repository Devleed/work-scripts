const { ethers } = require('ethers');
const { Pool } = require('pg');

// Configure your PostgreSQL connection
const pool = new Pool({
  user: '........',
  host: '172.27.0.6',
  database: '..........',
  password: '........',
  port: 5432, // Change if your PostgreSQL is running on a different port
  max: 1000,
});

async function generateRandomWallets(numWallets) {
  try {
    const wallets = [];

    for (let i = 0; i < numWallets; i++) {
      const randomWallet = ethers.Wallet.createRandom();
      wallets.push(randomWallet.address.slice(2));

      console.log(`Wallet ${i + 1}:`);
      console.log(`Address: ${randomWallet.address}`);
      console.log(`Private Key: ${randomWallet.privateKey}`);
      console.log('------------------------');
    }

    console.log(wallets);

    return wallets;
    // Optionally, you can return the array of wallets or use it for further processing.
    // return wallets;
  } catch (error) {
    console.error('Error generating wallets:', error.message);

    return [];
  }
}

// Function to generate a random string of specified length
function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

generateRandomWallets(100).then(walletAddresses => {
  const numberOfEntries = 100;

  // Example SQL query
  const sqlQuery =
    'INSERT INTO users (address, name, biography, "imageUrl", "bannerUrl", admin, "referralCode", "referrerAddress", timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';

  // Execute the query in a loop
  for (let i = 0; i < numberOfEntries; i++) {
    console.log('hello ', i);

    const values = [
      walletAddresses[i].toLowerCase(),
      null,
      null,
      null,
      null,
      false,
      generateRandomString(5),
      null,
      new Date(),
    ];

    pool.query(sqlQuery, values, (error, results) => {
      if (error) {
        console.error('Error executing SQL query:', error.message);
      } else {
        console.log('Query executed successfully.');
      }
    });
  }

  // Close the PostgreSQL pool when done
  pool.end();
});

// // Number of iterations
// async function runQuery() {
//   //   const sqlQuery = 'SELECT * FROM users;';

//   //   pool.query(sqlQuery, null, (error, results) => {
//   //     if (error) {
//   //       console.error('Error executing SQL query:', error.message);
//   //     } else {
//   //       console.log(results.rows.length);

//   //       const wallets = [];
//   //       results.rows.forEach(result => {
//   //         wallets.push(result.address);

//   //         // const sqlQuery2 = `INSERT INTO user_loyalties ("userAddress", "seasonNumber", points) VALUES ($1, $2, $3);`;

//   //         // const values = [result.address, 1, Math.floor(Math.random() * 20)];
//   //         // console.log('🚀 ~ pool.query ~ values:', values);

//   //         // pool.query(sqlQuery2, values, (error2, results2) => {
//   //         //   if (error) {
//   //         //     console.error('Error executing SQL query:', error.message);
//   //         //   } else {
//   //         //     console.log('Query executed successfullyyyyy.', results2?.rows);
//   //         //   }
//   //         // });
//   //       });

//   //       console.log(JSON.stringify(wallets));
//   //     }
//   //   });

//   const sqlQuery = `INSERT INTO reward_periods (distributor, "startTime", "endTime", amount, distributed) VALUES ($1, $2, $3, $4, $5)`;

//   const values = [
//     'LOYALTY_REWARDS',
//     new Date(1707124720 * 1000),
//     new Date(1707383920 * 1000),
//     1000,
//     false,
//   ];

//   pool.query(sqlQuery, values, (error, results) => {
//     if (error) {
//       console.log('🚀 ~ pool,query ~ error:', error);
//     } else {
//       console.log('🚀 ~ pool,query ~ results:', results);
//     }
//   });

//   pool.end();
// }

// runQuery();
