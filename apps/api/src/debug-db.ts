import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log('--- USUARIOS EN DB ---');
  users.forEach(u => {
    console.log(`- ID: ${u.id}, Email: ${u.email}, PIN: ${u.pin}, Role: ${u.role}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
