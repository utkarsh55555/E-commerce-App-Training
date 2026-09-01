const userService = require('../modules/user/userService');
const asyncHandler = require('../utils/asyncHandler');
const apiResponse = require('../utils/apiResponse');
const { OK, CREATED, UNAUTHORIZED } = require('../utils/httpStatus');

const getUserProfileController = asyncHandler(async (req, res) => {
    const userData = await userService.getUserProfile(req.user._id);
    res.status(OK).json(apiResponse(OK, userData, "data fetch successfully"));
});

const updateUserProfileController = asyncHandler(async (req, res) => {
    const id = req.user._id;
    const data = req.body;
    const image = req.file;

    let allowed = ["name", "phone"];
    if (req.user.role === "seller") {
        allowed.push("shopName");
    }
    const invalidFields = Object.keys(data).filter(
        (key) => !allowed.includes(key),
    );
    if (invalidFields.length > 0) {
        return res.status(UNAUTHORIZED).json(apiResponse(UNAUTHORIZED, null, `You are unauthorized to update: ${invalidFields.join(", ")}`));
    }

    const result = await userService.updateUserProfile(id, data, image);
    res.status(OK).json(apiResponse(OK, result, "Profile updated successfully"));
});

const getAllAddressesController = asyncHandler(async (req, res) => {
    const addresses = await userService.getAllAddress(req.user._id);
    res.status(OK).json(apiResponse(OK, addresses, "fetch all user addresses"));
});

const createAddressController = asyncHandler(async (req, res) => {
    const id = req.user._id;
    const data = req.body;
    const result = await userService.addAddress(id, data);
    res.status(OK).json(apiResponse(OK, result, "address created successfully"));
});

const updateAddressController = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const addressId = req.params.addrId;
    const patch = req.body;
    const result = await userService.updateAddress(userId, addressId, patch);
    res.status(OK).json(apiResponse(OK, result, "address updated successfully"));
});

const deleteAddressController = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const addressId = req.params.addrId;
    const result = await userService.deleteAddress(userId, addressId);
    res.status(OK).json(apiResponse(OK, result, "address deleted successfully"));
});

module.exports = {
    getUserProfileController,
    updateUserProfileController,
    getAllAddressesController,
    createAddressController,
    updateAddressController,
    deleteAddressController,
};
