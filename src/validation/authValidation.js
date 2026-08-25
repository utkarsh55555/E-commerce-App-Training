const apiResponse = require("../utils/apiResponse");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[0-9 ()-]{7,20}$/;

const validateRegister = (req, res, next) => {
	const { name, email, password, phone, role } = req.body || {};
	const errors = {};

	if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 50) {
		errors.name = "Name must be between 2 and 50 characters";
	}
	if (typeof email !== "string" || !emailPattern.test(email.trim())) {
		errors.email = "A valid email is required";
	}
	if (typeof password !== "string" || password.length < 6 || password.length > 128) {
		errors.password = "Password must be between 6 and 128 characters";
	}
	if (phone !== undefined && (typeof phone !== "string" || !phonePattern.test(phone.trim()))) {
		errors.phone = "Phone number is invalid";
	}

	if (Object.keys(errors).length > 0) {
		return res.status(400).json(apiResponse(400, { errors }, "Validation failed"));
	}

	req.body.name = name.trim();
	req.body.email = email.trim().toLowerCase();
	if (phone !== undefined) req.body.phone = phone.trim();
	return next();
};

const validateLogin = (req, res, next) => {
	const { email, password } = req.body || {};
	const errors = {};

	if (typeof email !== "string" || !emailPattern.test(email.trim())) {
		errors.email = "A valid email is required";
	}
	if (typeof password !== "string" || password.length === 0) {
		errors.password = "Password is required";
	}

	if (Object.keys(errors).length > 0) {
		return res.status(400).json(apiResponse(400, { errors }, "Validation failed"));
	}

	req.body.email = email.trim().toLowerCase();
	return next();
};

module.exports = {
	validateRegister,
	validateLogin
};
