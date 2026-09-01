const bcrypt = require('bcrypt');
const User = require('../../models/userSchema');
const { signAccessToken, signRefreshToken } = require('../../utils/token');
const apiError = require('../../utils/apiError');

const registerUser = async (userData) => {
    const { name, email, password, phone, role } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw apiError(409, 'User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
        name,
        email,
        password: hashedPassword,
        phone,
        role: role || 'user'
    });

    await user.save();
    return user;
};

const loginUser = async (credentials) => {
    const { email, password } = credentials;

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw apiError(401, 'Invalid email or password');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw apiError(401, 'Invalid email or password');
    }

    // Generate tokens
    const accessToken = await signAccessToken(user);
    const refreshToken = await signRefreshToken(user);

    return {
        accessToken,
        refreshToken,
        user
    };
};

const logoutUser = async (userId) => {
    // If you implement token blacklisting, do it here
    return true;
};

const refreshAccessToken = async (refreshToken) => {
    const { verifyRefreshToken } = require('../../utils/token');
    
    try {
        const decoded = await verifyRefreshToken(refreshToken);
        const user = await User.findById(decoded.sub);
        
        if (!user) {
            throw apiError(401, 'User not found');
        }

        const newAccessToken = await signAccessToken(user);
        return newAccessToken;
    } catch (error) {
        throw apiError(401, 'Invalid refresh token');
    }
};

const changePassword = async (user, oldPassword, newPassword) => {
    const userWithPassword = await User.findById(user._id).select('+password');
    const isPasswordValid = await bcrypt.compare(oldPassword, userWithPassword.password);
    if (!isPasswordValid) {
        throw apiError(401, 'Invalid password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    userWithPassword.password = hashedPassword;
    await userWithPassword.save();
    return userWithPassword;
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePassword
};
