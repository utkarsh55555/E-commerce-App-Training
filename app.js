const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const morgan = require("morgan");
const { rateLimit } = require("express-rate-limit");
const apiResponse = require("./src/utils/apiResponse");
const errorHandler = require("./src/middlewares/errorHandler");

require("dotenv").config();

const app = express();

const authRoutes = require("./src/routes/authRoutes");

app.use(express.json());
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*", credentials: true }));
app.use(cookieParser());
app.use((req, res, next) => {
    ["body", "params", "headers", "query"].forEach((key) => {
        if (req[key]) {
            mongoSanitize.sanitize(req[key]);
        }
    });
    next();
});
app.use(compression());
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));

app.get("/api/v1/health", (req, res) => {
    res.status(200).json(apiResponse(200, {
        service: "ecom-backend",
        env: process.env.NODE_ENV || "development",
        uptimeSeconds: Math.round(process.uptime()),
        timestamp: new Date().toISOString()
    }, "API is running"));
});

app.use("/api/v1/auth", authRoutes);

app.use((req, res) => {
    res.status(404).json(apiResponse(404, null, "Route not found"));
});

app.use(errorHandler);

module.exports = app;