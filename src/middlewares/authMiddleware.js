const { verifyAccessToken } = require('../utils/token');
const apiError = require('../utils/apiError');
const apiResponse = require('../utils/apiResponse');
const User = require('../models/userSchema');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json(
                apiResponse(401, null, 'Access token is missing')
            );
        }

        const decoded = await verifyAccessToken(token);
        const user = await User.findById(decoded.sub);

        if (!user) {
            return res.status(401).json(
                apiResponse(401, null, 'User not found')
            );
        }

        req.user = user;
        req.userId = decoded.sub;
        next();
    } catch (error) {
        return res.status(401).json(
            apiResponse(401, null, 'Invalid or expired access token')
        );
    }
};

const roleMiddleware = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json(
                apiResponse(401, null, 'Authentication required')
            );
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json(
                apiResponse(403, null, 'You do not have permission to access this resource')
            );
        }

        next();
    };
};

module.exports = {
    authMiddleware,
    roleMiddleware
};
