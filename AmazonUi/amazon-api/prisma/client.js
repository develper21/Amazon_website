// Prisma client setup for Node.js API
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: ['error'],
  errorFormat: 'pretty',
});

// Global error handling for database connection issues
prisma.$on('error', (e) => {
  console.error('Database error:', e);
});

// Add this to handle connection issues
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = prisma;
