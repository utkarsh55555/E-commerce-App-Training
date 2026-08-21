require("dotenv").config();

const app = require("./app");
const connectDB = require("./src/config/db");

const port = Number(process.env.PORT) || 3000;

const start = async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exitCode = 1;
    }
};

start();