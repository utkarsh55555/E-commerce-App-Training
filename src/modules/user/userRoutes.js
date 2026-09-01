const express = require('express');
const router = express.Router();
const { uploadSingle } = require('../../middlewares/uploadMiddleware');
const apiResponse = require('../../utils/apiResponse');

router.post('/upload-test', uploadSingle('image'), (req, res) => {
    res.status(200).json(apiResponse(200, {
        url: req.cloudinaryUrl,
        publicId: req.cloudinaryPublicId
    }, 'Image uploaded successfully'));
});

module.exports = router;

router.get('/me', (req, res) => {
    res.status(200).json(apiResponse(200, req.user, 'User retrieved successfully'));
});

router.get

module.exports = router;