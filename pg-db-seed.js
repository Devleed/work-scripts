require('dotenv').config();
const { DataSource, EntitySchema } = require('typeorm');
const { faker } = require('@faker-js/faker');

const TokenEntity = new EntitySchema({
  name: 'Token',
  tableName: 'tokens',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    coingecko_id: {
      type: 'varchar',
    },
    symbol: {
      type: 'varchar',
    },
    name: {
      type: 'varchar',
    },
    image: {
      type: 'varchar',
    },
    contract_addresses: {
      type: 'jsonb',
    },
    prices: {
      type: 'jsonb',
    },
    last_updated: {
      type: 'timestamp',
    },
  },
});

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'user1',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'pg1',
  entities: [TokenEntity],
  synchronize: false, // Disable synchronize
});

async function seed() {
  const BATCH_SIZE = 500; // Reduce batch size for easier processing
  const TOTAL_ITEMS = 1_000_000;

  try {
    await AppDataSource.initialize();
    console.log('📦 DataSource initialized');

    const repo = AppDataSource.getRepository('Token');

    console.log('📦 here');

    for (let i = 0; i < TOTAL_ITEMS; i += BATCH_SIZE) {
      const items = Array.from({ length: BATCH_SIZE }).map(() => {
        return {
          coingecko_id: faker.finance.accountNumber(),
          symbol: faker.finance.currencySymbol(),
          name: faker.finance.accountName(),
          image: '',
          last_updated: new Date(),
          contract_addresses: {
            solana: faker.finance.ethereumAddress(),
            ethereum: faker.finance.ethereumAddress(),
          },
          prices: {
            usd: faker.finance.amount(),
          },
        };
      });

      try {
        // Bulk insert using query builder for better performance
        await AppDataSource.createQueryBuilder()
          .insert()
          .into('tokens')
          .values(items)
          .execute();
      } catch (e) {
        console.error('❌ Error saving items', e);
      }
      console.log(`✅ Inserted ${i + BATCH_SIZE} items`);
    }

    console.log('🌱 Seeding complete');
    await AppDataSource.destroy();
  } catch (e) {
    console.error('❌ Error during seeding', e);
  }
}

seed().catch(err => {
  console.error('❌ Seeding failed', err);
  process.exit(1);
});
