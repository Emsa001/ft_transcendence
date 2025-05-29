// db/client.ts
import { Sequelize } from "sequelize";

// SQLite DB will be saved in a local file called `database.sqlite`
export const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite",
    logging: false, // Set to true if you want SQL logs
});

export async function initDb() {
    await sequelize.sync({ alter: true }); // Use { force: true } if you want to reset
    console.log("Database synced");
}
