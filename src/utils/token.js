const jwt = require('jsonwebtoken');

const signAccessToken = (user) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            { sub: String(user._id), role: user.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' },
            (err, token) => {
                if (err) {
                    reject(new Error('Error signing access token'));
                } else {
                    resolve(token);
                }
            }
        );
    });
};

const signRefreshToken = (user) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            { sub: String(user._id), role: user.role },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) {
                    reject(new Error('Error signing refresh token'));
                } else {
                    resolve(token);
                }
            }
        );
    });
};

const verifyAccessToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
};

const verifyRefreshToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
};

const refreshCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
});

const accessCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000
});

module.exports = {
    signAccessToken,
    signRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    refreshCookieOptions,
    accessCookieOptions
};