const apiError = require('../utils/apiError');
const { NOT_FOUND } = require('../utils/httpStatus');

const loadResource = (Model) => {
    return async (req, res, next) => {
        try {
            const resource = await Model.findById(req.params.id);
            if (!resource) {
                throw apiError(NOT_FOUND, `${Model.modelName} not found`);
            }
            req.resource = resource;
            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = loadResource;
