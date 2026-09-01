const apiResponse = require("../../utils/apiResponse");
const { BAD_REQUEST } = require("../../utils/httpStatus");

const validateBrand = (req, res, next) => {
    const { name, isActive } = req.body;
    const errors = {};

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
        errors.name = "Name is required and must be at least 2 characters";
    }

    if (isActive !== undefined && typeof isActive !== 'boolean') {
        errors.isActive = "isActive must be a boolean";
    }

    if (Object.keys(errors).length > 0) {
        return res.status(BAD_REQUEST).json(apiResponse(BAD_REQUEST, { errors }, "Validation failed"));
    }

    next();
};

module.exports = { validateBrand };
