// prisma/seed.ts
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import { PrismaClient, Role } from '../src/generated/prisma/client.js';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash('provider123', 10);

  const provider = await prisma.user.upsert({
    where: { email: 'provider@careslot.com' },
    update: {},
    create: {
      email: 'provider@careslot.com',
      password: password,
      role: Role.PROVIDER,
    },
  });

  console.log('Provider seeded:', provider.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });