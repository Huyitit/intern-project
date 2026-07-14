import { PrismaClient } from "../../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { config } from "./env";

const adapter = new PrismaMariaDb({
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPass,
    database: config.dbName,
    port: Number(config.dbPort),
    connectionLimit: 5,
    connectTimeout: 20000,
    ssl: {
        rejectUnauthorized: false
    }
});

const prisma = new PrismaClient({ adapter });

export default prisma;