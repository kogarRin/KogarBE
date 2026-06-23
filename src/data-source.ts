import "reflect-metadata"
import { config } from "dotenv"
import { DataSource } from "typeorm"

config()

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DATABASE_HOST || "localhost",
    port: parseInt(process.env.DATABASE_PORT || "5432"),
    username: process.env.DATABASE_USER || "postgres",
    password: process.env.DATABASE_PASSWORD || "kkl5367.33",
    database: process.env.DATABASE_NAME || "kor-db",
    synchronize: false,
    logging: true,
    entities: ["dist/**/*.entity.js"],
    migrations: ["dist/migrations/*.js"],

    subscribers: [],
})
