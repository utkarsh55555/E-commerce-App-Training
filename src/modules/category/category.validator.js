const apiResponse = require("../../utils/apiResponse");
const { BAD_REQUEST } = require("../../utils/httpStatus");

const validateCategory = (req, res, next) => {
    const { name, parent, position, isActive } = req.body;
    const errors = {};

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
        errors.name = "Name is required and must be at least 2 characters";
    }

    if (parent !== undefined && parent !== null && parent !== "") {
        if (typeof parent !== 'string') {
            errors.parent = "Parent must be a valid ID";
        }
    }

    if (position !== undefined && (typeof position !== 'number' || position < 0)) {
        errors.position = "Position must be a non-negative number";
    }

    if (isActive !== undefined && typeof isActive !== 'boolean') {
        errors.isActive = "isActive must be a boolean";
    }

    if (Object.keys(errors).length > 0) {
        return res.status(BAD_REQUEST).json(apiResponse(BAD_REQUEST, { errors }, "Validation failed"));
    }

    next();
};

module.exports = { validateCategory };
