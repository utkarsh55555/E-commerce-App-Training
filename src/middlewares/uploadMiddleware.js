const multer = require('multer');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');
const apiError = require('../utils/apiError');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

const uploadSingle = (fieldName) => {
    return async (req, res, next) => {
        const uploadSingleField = upload.single(fieldName);
        
        uploadSingleField(req, res, async (err) => {
            if (err) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return next(apiError(400, 'File size exceeds 5MB limit'));
                }
                return next(apiError(400, err.message));
            }
            
            if (!req.file) {
                return next();
            }

            try {
                const result = await uploadToCloudinary(req.file.buffer);
                req.cloudinaryUrl = result.url;
                req.cloudinaryPublicId = result.public_id;
                next();
            } catch (error) {
                next(error);
            }
        });
    };
};

const uploadMultiple = (fieldName, maxCount = 5) => {
    return async (req, res, next) => {
        const uploadMultipleFields = upload.array(fieldName, maxCount);
        
        uploadMultipleFields(req, res, async (err) => {
            if (err) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return next(apiError(400, 'File size exceeds 5MB limit'));
                }
                return next(apiError(400, err.message));
            }
            
            if (!req.files || req.files.length === 0) {
                return next();
            }

            try {
                const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer));
                const results = await Promise.all(uploadPromises);
                req.cloudinaryUrls = results.map(r => r.url);
                req.cloudinaryPublicIds = results.map(r => r.public_id);
                next();
            } catch (error) {
                next(error);
            }
        });
    };
};

module.exports = {
    upload,
    uploadSingle,
    uploadMultiple
};
