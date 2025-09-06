import App from "../app";
import dotenv from "dotenv";

dotenv.config();

const start = async () => {
    const app = await App();
    const port = Number(process.env.PORT) || 3000;

    try {
        await app.listen({ port, host: "0.0.0.0" });
        console.log(`Server running on http://localhost:${port}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
