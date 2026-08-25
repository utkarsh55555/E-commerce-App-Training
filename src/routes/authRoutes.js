const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { registerController, loginController, logoutController, changePasswordController } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../validation/authValidation');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/register', validateRegister, asyncHandler(registerController));
router.post('/login', validateLogin, asyncHandler(loginController));
router.post('/logout', authMiddleware, asyncHandler(logoutController));
router.post('/change-password', authMiddleware, asyncHandler(changePasswordController));
module.exports = router;
