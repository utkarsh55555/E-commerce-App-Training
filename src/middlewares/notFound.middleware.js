const apiResponse = require('../utils/apiResponse');

const notFound = (req, res, next) => {
    res.status(404).json(apiResponse(404, null, 'Route not found'));
};

module.exports = notFound;
