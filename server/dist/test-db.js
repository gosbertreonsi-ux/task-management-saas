"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function testConnection() {
    try {
        await prisma.$connect();
        console.log("✅ Database connected successfully!");
    }
    catch (error) {
        console.error("❌ Database connection failed:");
        console.error(error);
    }
    finally {
        await prisma.$disconnect();
    }
}
testConnection();
