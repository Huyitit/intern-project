import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { config } from "./env";

const adapter = new PrismaMariaDb({
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPass,
    database: config.dbName,
    connectionLimit: 5,
});

const prisma = new PrismaClient({adapter});

export default prisma;