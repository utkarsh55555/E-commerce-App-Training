const Authservice = require('../Services/authService');
const asyncHandler = require('../utils/asyncHandler');
const apiResponse = require('../utils/apiResponse');

const registerController = asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body;
    const user = await Authservice.registerUser({ name, email, password, phone });
    res.status(201).json(apiResponse(201, { user }, "User registered successfully"));
});

const loginController = asyncHandler(async (req, res) => {   
    const { email, password } = req.body;
    const token = await Authservice.loginUser({ email, password });
    res.status(200).json(apiResponse(200, { token }, "User logged in successfully"));
});

const logoutController = asyncHandler(async (req, res) => {
    await Authservice.logoutUser(req.user);
    res.status(200).json(apiResponse(200, null, "User logged out successfully"));
}); 

const changePasswordController = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    await Authservice.changePassword(req.user, oldPassword, newPassword);
    res.status(200).json(apiResponse(200, null, "Password changed successfully"));
});

const refreshController = asyncHandler(async (req,res)=>{
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(401).json(apiResponse(401, null, "Refresh token not found"));
    }
    const token = await Authservice.refreshToken(refreshToken);
    res.status(200).json(apiResponse(200, { token }, "Token refreshed successfully"));
})

module.exports = {
    registerController,
    loginController,
    logoutController,
    changePasswordController,
    refreshController
};