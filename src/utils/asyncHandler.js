const asyncHandler = require("express-async-handler");

const asyncHandlerWrapper = asyncHandler(async (req, res, next) => {
    try {
        await next();
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Internal Server Error";
        res.status(statusCode).json({ error: message });
    }   
});

module.exports = asyncHandlerWrapper;