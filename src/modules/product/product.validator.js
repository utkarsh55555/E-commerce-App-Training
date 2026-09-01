const apiResponse = require("../../utils/apiResponse");
const { BAD_REQUEST } = require("../../utils/httpStatus");

const validateProduct = (req, res, next) => {
    const { title, price, mrp, category, stockQty } = req.body;
    const errors = {};

    if (!title || typeof title !== 'string' || title.trim().length < 3) {
        errors.title = "Title is required and must be at least 3 characters";
    }

    if (!price || typeof price !== 'number' || price < 0) {
        errors.price = "Price is required and must be a positive number";
    }

    if (!mrp || typeof mrp !== 'number' || mrp < 0) {
        errors.mrp = "MRP is required and must be a positive number";
    }

    if (price && mrp && price > mrp) {
        errors.price = "Price cannot exceed MRP";
    }

    if (!category) {
        errors.category = "Category is required";
    }

    if (stockQty !== undefined && (typeof stockQty !== 'number' || stockQty < 0)) {
        errors.stockQty = "Stock quantity must be a non-negative number";
    }

    if (Object.keys(errors).length > 0) {
        return res.status(BAD_REQUEST).json(apiResponse(BAD_REQUEST, { errors }, "Validation failed"));
    }

    next();
};

module.exports = { validateProduct };
