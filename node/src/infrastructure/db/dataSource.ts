import "reflect-metadata";
import { DataSource } from "typeorm";
import { TaskEntity } from "../entities/TaskEntity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "Admin123!",
  database: process.env.DB_NAME || "todo",
  synchronize: true, // true for dev only, auto create tables
  logging: false,
  entities: [TaskEntity],
  migrations: [],
  subscribers: [],
});
