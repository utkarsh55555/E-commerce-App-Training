const apiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");
const { OK, CREATED } = require("../../utils/httpStatus");
const ProductService = require("./product.service");

const getAllProductsController = asyncHandler(async (req, res) => {
    const result = await ProductService.getAllProductsService(req.query);
    res.status(OK).json(apiResponse(OK, result, "all products fetched successfully"));
});

const getProductByIdController = asyncHandler(async (req, res) => {
    const result = await ProductService.getProductByIdService(req.params.id);
    res.status(OK).json(apiResponse(OK, result, "product fetched successfully"));
});

const createProductController = asyncHandler(async (req, res) => {
    const files = req.files;
    const videoFile = req.files?.video ? req.files.video[0] : null;
    const imageFiles = req.files?.images || [];
    
    const result = await ProductService.createProductService(req.body, imageFiles, videoFile);
    res.status(CREATED).json(apiResponse(CREATED, result, "product created successfully"));
});

const updateProductController = asyncHandler(async (req, res) => {
    const files = req.files;
    const videoFile = req.files?.video ? req.files.video[0] : null;
    const imageFiles = req.files?.images || [];
    
    const result = await ProductService.updateProductService(req.resource, req.body, imageFiles, videoFile);
    res.status(OK).json(apiResponse(OK, result, "product updated successfully"));
});

const deleteProductController = asyncHandler(async (req, res) => {
    const result = await ProductService.deleteProductService(req.resource);
    res.status(OK).json(apiResponse(OK, result, "product deleted successfully"));
});

const searchProductsController = asyncHandler(async (req, res) => {
    const result = await ProductService.searchProductsService(req.query);
    res.status(OK).json(apiResponse(OK, result, "products searched successfully"));
});

const getAllProductSellerController = asyncHandler(async (req, res) => {
    const result = await ProductService.getAllProductSellerService(req.query);
    res.status(OK).json(apiResponse(OK, result, "all products fetched successfully"));
});

module.exports = {
    getAllProductsController,
    getProductByIdController,
    createProductController,
    updateProductController,
    deleteProductController,
    searchProductsController
};
