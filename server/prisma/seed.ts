import { PrismaClient } from "@prisma/client";
import process from "process";

const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({
    data: [
      { name: "ADMIN" },
      { name: "MEMBER" }
    ],
    skipDuplicates: true
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });