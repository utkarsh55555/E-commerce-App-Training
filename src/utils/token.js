const signAccessToken = (user) => {
    jwt.sign({sub: String(user._id),role:user.role}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'}, (err, token) => {
        if(err) {
            throw new Error('Error signing access token');
        }
    });
};  

const signRefreshToken = (user) => {
    jwt.sign({sub: String(user._id),role:user.role}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'}, (err, token) => {
        if(err) { 
        throw new Error('Error signing refresh token');
        }
    });
}

const verifyAccessToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
            if(err) {
                reject(err);
            }
        })
    });
}

const verifyRefreshToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err) => { 
            if(err) {
                reject(err);
            }       
        });
    });
}

module.exports = {
    signAccessToken,
    signRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}