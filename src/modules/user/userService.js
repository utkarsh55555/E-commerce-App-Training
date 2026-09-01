const User = require('../../models/userSchema');
const apiError = require('../../utils/apiError');
const { NOT_FOUND, FORBIDDEN } = require('../../utils/httpStatus');
const { uploadToCloudinary, destroyFromCloudinary } = require('../../utils/uploadToCloudinary');

const setOthersDefaultFalse = (currentAddressId, addresses) => {
    addresses.forEach((address) => {
        if (address._id !== currentAddressId) {
            address.isDefault = false;
        }
    });
};

const getUserProfile = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw apiError(NOT_FOUND, "user not found");
    }
    return user;
};

const updateUserProfile = async (id, data, file) => {
    const updatedData = { ...data };
    const user = await User.findById(id);
    if (!user) {
        throw apiError(404, "User not found");
    }
    if (file) {
        const image = await uploadToCloudinary(file.buffer, "ecom/users");
        if (user.profilephoto?.publicId) {
            await destroyFromCloudinary(user.profilephoto.publicId);
        }
        updatedData.profilephoto = image;
    }
    const result = await User.findByIdAndUpdate(id, updatedData,
        { new: true, runValidators: true });
    return result;
};

const getAllAddress = async (id) => {
    const user = await User.findById(id);
    if (!user) {
        throw apiError(NOT_FOUND, "user not found");
    }
    if (user.addresses.length <= 0) {
        throw apiError(NOT_FOUND, "you don't have any address, please create one");
    }
    return user.addresses;
};

const addAddress = async (id, data) => {
    const user = await getUserProfile(id);

    if (user?.addresses.length > 5) {
        throw apiError(FORBIDDEN, "max addresses limit reached, can't create more");
    }
    if (user?.addresses.length !== 0) {
        user?.addresses.forEach((address) => address.isDefault = false);
    }

    user.addresses.push(data);
    await user.save();

    return user;
};

const updateAddress = async (userId, addressId, patch) => {
    const userData = await getUserProfile(userId);
    const address = userData.addresses.id(addressId);
    if (!address) {
        throw apiError(NOT_FOUND, "address not found");
    };

    Object.assign(address, patch);

    if (patch.isDefault) {
        setOthersDefaultFalse(addressId, userData.addresses);
    };

    await userData.save();
    return userData;
};

const deleteAddress = async (userId, addressId) => {
    const userData = await getUserProfile(userId);

    const address = userData.addresses.id(addressId);
    if (!address) {
        throw apiError(NOT_FOUND, "address not found");
    };

    const wasDefault = address.isDefault;
    address.deleteOne();
    if (userData.addresses.length > 0 && wasDefault === true) {
        userData.addresses[0].isDefault = true;
    }

    await userData.save();
    return userData;
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    getAllAddress,
    addAddress,
    updateAddress,
    deleteAddress
};
