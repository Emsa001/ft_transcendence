// db/init.ts
import { sequelize } from "./client";

export async function initDb() {
    await sequelize.sync({ alter: true }); // Use { force: true } if you want to reset
    console.log("Database synced");
}
