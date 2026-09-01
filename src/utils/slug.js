const crypto = require('crypto');

const convertToSlug = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
};

const nanoId = () => {
    return crypto.randomBytes(4).toString('hex');
};

module.exports = { convertToSlug, nanoId };
