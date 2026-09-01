const ProductModel = require("../../models/product.model");
const apiError = require("../../utils/apiError");
const { NOT_FOUND, CONFLICT } = require("../../utils/httpStatus");
const { uploadToCloudinary, destroyFromCloudinary } = require("../../utils/uploadToCloudinary");

const getAllProductsService = async (filters = {}) => {
    const { category, brand, seller, minPrice, maxPrice, search } = filters;
    
    const query = { isActive: true };
    
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (seller) query.seller = seller;
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = minPrice;
        if (maxPrice) query.price.$lte = maxPrice;
    }
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { tags: { $in: [new RegExp(search, 'i')] } }
        ];
    }

    const products = await ProductModel.find(query)
        .populate('category', 'name slug')
        .populate('subCategory', 'name slug')
        .populate('brand', 'name slug')
        .populate('seller', 'name email')
        .sort({ createdAt: -1 })
        .lean();

    return products;
};

const getProductByIdService = async (productId) => {
    const product = await ProductModel.findById(productId)
        .populate('category', 'name slug')
        .populate('subCategory', 'name slug')
        .populate('brand', 'name slug')
        .populate('seller', 'name email')
        .lean();

    if (!product) {
        throw apiError(NOT_FOUND, "Product not found");
    }

    return product;
};

const createProductService = async (payload, files, videoFile) => {
    const { title, slug } = payload;
    
    if (slug) {
        const isExist = await ProductModel.findOne({ slug });
        if (isExist) {
            throw apiError(CONFLICT, "Product with this slug already exists");
        }
    }

    if (files && files.length > 0) {
        const uploadPromises = files.map(file => uploadToCloudinary(file.buffer, "ecom/product"));
        const results = await Promise.all(uploadPromises);
        payload.images = results.map(r => ({ url: r.url, publicId: r.publicId }));
    }

    if (videoFile) {
        const videoResult = await uploadToCloudinary(videoFile.buffer, "ecom/product/video");
        payload.video = { url: videoResult.url, publicId: videoResult.publicId };
    }

    const result = await ProductModel.create(payload);
    return result;
};

const updateProductService = async (product, payload, files, videoFile) => {
    const allowedFields = ['title', 'description', 'price', 'mrp', 'category', 'subCategory', 'brand', 'stockQty', 'tags', 'isActive'];
    
    allowedFields.forEach(field => {
        if (payload[field] !== undefined) {
            product[field] = payload[field];
        }
    });

    if (files && files.length > 0) {
        const uploadPromises = files.map(file => uploadToCloudinary(file.buffer, "ecom/product"));
        const results = await Promise.all(uploadPromises);
        
        if (product.images && product.images.length > 0) {
            const deletePromises = product.images.map(img => destroyFromCloudinary(img.publicId));
            await Promise.all(deletePromises);
        }
        
        product.images = results.map(r => ({ url: r.url, publicId: r.publicId }));
    }

    if (videoFile) {
        if (product.video && product.video.publicId) {
            await destroyFromCloudinary(product.video.publicId);
        }
        const videoResult = await uploadToCloudinary(videoFile.buffer, "ecom/product/video");
        product.video = { url: videoResult.url, publicId: videoResult.publicId };
    }

    await product.save();
    return product;
};

const deleteProductService = async (product) => {
    if (product.images && product.images.length > 0) {
        const deletePromises = product.images.map(img => destroyFromCloudinary(img.publicId));
        await Promise.all(deletePromises);
    }

    if (product.video && product.video.publicId) {
        await destroyFromCloudinary(product.video.publicId);
    }

    await product.deleteOne();
    return product;
};

module.exports = {
    getAllProductsService,
    getProductByIdService,
    createProductService,
    updateProductService,
    deleteProductService
};
