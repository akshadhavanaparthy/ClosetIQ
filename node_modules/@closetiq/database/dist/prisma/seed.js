"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("@closetiq/database");
const prisma = new database_1.PrismaClient();
async function main() {
    console.log('No example users, merchant catalog, or image assets are seeded.');
}
main()
    .catch((error) => {
    console.error('Database seed failed:', error);
    process.exitCode = 1;
})
    .finally(async () => {
    await prisma.$disconnect();
});
