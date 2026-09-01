

const apiResponse = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json(apiResponse(statusCode, null, message));
};

module.exports = errorHandler;
