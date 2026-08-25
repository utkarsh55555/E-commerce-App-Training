const userService = require('../Services/userService');
const asyncHandler = require('../utils/asyncHandler');
const apiResponse = require('../utils/apiResponse');

const getUserProfileController = asyncHandler(async (req, res) => {
    const user = await userService.getUserProfile(req.userId);
    res.status(200).json(apiResponse(200, user, 'User profile retrieved successfully'));
});

const updateUserProfileController = asyncHandler(async (req, res) => {
    const user = await userService.updateUserProfile(req.userId, req.body);
    res.status(200).json(apiResponse(200, user, 'User profile updated successfully'));
});

const addAddressController = asyncHandler(async (req, res) => {
    const user = await userService.addAddress(req.userId, req.body);
    res.status(201).json(apiResponse(201, user, 'Address added successfully'));
});

const updateAddressController = asyncHandler(async (req, res) => {
    const { addressId } = req.params;
    const user = await userService.updateAddress(req.userId, addressId, req.body);
    res.status(200).json(apiResponse(200, user, 'Address updated successfully'));
});

const deleteAddressController = asyncHandler(async (req, res) => {
    const { addressId } = req.params;
    const user = await userService.deleteAddress(req.userId, addressId);
    res.status(200).json(apiResponse(200, user, 'Address deleted successfully'));
});

module.exports = {
    getUserProfileController,
    updateUserProfileController,
    addAddressController,
    updateAddressController,
    deleteAddressController
};
