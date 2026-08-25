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
console.log("Register page is on http://localhost:3000/api/v1/auth/register");
console.log("Login page is on http://localhost:3000/api/v1/auth/login");
console.log("Logout page is on http://localhost:3000/api/v1/auth/logout");
console.log("Change password page is on http://localhost:3000/api/v1/auth/change-password");
console.log("Health check is on http://localhost:3000/api/v1/health");
console.log("API is running on http://localhost:3000");

