const cloudinary = require('../config/cloudinary');
const apiError = require('./apiError');

const uploadToCloudinary = async (file, folder = 'ecommerce') => {
    try {
        const result = await cloudinary.uploader.upload(file, {
            folder,
            resource_type: 'auto'
        });
        return {
            url: result.secure_url,
            public_id: result.public_id
        };
    } catch (error) {
        throw apiError(500, `Image upload failed: ${error.message}`);
    }
};

const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
        return true;
    } catch (error) {
        throw apiError(500, `Image deletion failed: ${error.message}`);
    }
};

module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary
};
