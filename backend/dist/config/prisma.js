"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../generated/prisma/client");
const adapter_mariadb_1 = require("@prisma/adapter-mariadb");
const env_1 = require("./env");
const adapter = new adapter_mariadb_1.PrismaMariaDb({
    host: env_1.config.dbHost,
    user: env_1.config.dbUser,
    password: env_1.config.dbPass,
    database: env_1.config.dbName,
    port: Number(env_1.config.dbPort),
    connectionLimit: 5,
    connectTimeout: 20000,
    ssl: {
        rejectUnauthorized: false
    }
});
const prisma = new client_1.PrismaClient({ adapter });
exports.default = prisma;
