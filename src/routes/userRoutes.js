const express = require('express');
const router = express.Router();
const { uploadSingle } = require('../middlewares/uploadMiddleware');
const apiResponse = require('../utils/apiResponse');

router.post('/upload-test', uploadSingle('image'), (req, res) => {
    res.status(200).json(apiResponse(200, {
        url: req.cloudinaryUrl,
        publicId: req.cloudinaryPublicId
    }, 'Image uploaded successfully'));
});

module.exports = router;
