const User = require('../models/userSchema');
const apiError = require('../utils/apiError');

const getUserProfile = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw apiError(404, 'User not found');
    }

    return user;
};

const updateUserProfile = async (userId, updateData) => {
    const { name, phone, profilephoto } = updateData;
    const updates = {};

    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (profilephoto) updates.profilephoto = profilephoto;

    const user = await User.findByIdAndUpdate(
        userId,
        updates,
        { new: true }
    );

    if (!user) {
        throw apiError(404, 'User not found');
    }

    return user;
};

const addAddress = async (userId, addressData) => {
    const { label, street, city, state, postalCode, country } = addressData;

    const user = await User.findByIdAndUpdate(
        userId,
        {
            $push: {
                addresses: {
                    label,
                    street,
                    city,
                    state,
                    postalCode,
                    country
                }
            }
        },
        { new: true }
    );

    if (!user) {
        throw apiError(404, 'User not found');
    }

    return user;
};

const updateAddress = async (userId, addressId, addressData) => {
    const { label, street, city, state, postalCode, country } = addressData;

    const user = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                'addresses.$[elem].label': label,
                'addresses.$[elem].street': street,
                'addresses.$[elem].city': city,
                'addresses.$[elem].state': state,
                'addresses.$[elem].postalCode': postalCode,
                'addresses.$[elem].country': country
            }
        },
        {
            arrayFilters: [{ 'elem._id': addressId }],
            new: true
        }
    );

    if (!user) {
        throw apiError(404, 'User not found');
    }

    return user;
};

const deleteAddress = async (userId, addressId) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { addresses: { _id: addressId } } },
        { new: true }
    );

    if (!user) {
        throw apiError(404, 'User not found');
    }

    return user;
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    addAddress,
    updateAddress,
    deleteAddress
};
