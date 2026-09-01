const express = require("express");
const ProductRouter = express.Router();
const ProductController = require("./product.controller");
const { upload } = require("../../middlewares/uploadMiddleware");
const loadResource = require("../../middlewares/loadResource.middleware");
const ProductModel = require("../../models/product.model");

ProductRouter.get("/", ProductController.getAllProductsController);
ProductRouter.get("/:id", ProductController.getProductByIdController);
ProductRouter.post("/", upload.fields([{ name: 'images', maxCount: 5 }, { name: 'video', maxCount: 1 }]), ProductController.createProductController);
ProductRouter.patch("/:id", loadResource(ProductModel), upload.fields([{ name: 'images', maxCount: 5 }, { name: 'video', maxCount: 1 }]), ProductController.updateProductController);
ProductRouter.delete("/:id", loadResource(ProductModel), ProductController.deleteProductController);
ProductRouter.post("/upload-test", upload.fields([{ name: 'images', maxCount: 5 }, { name: 'video', maxCount: 1 }]), ProductController.uploadTestController);
ProductRouter.get("/category/:categoryId", ProductController.getProductsByCategoryController);
ProductRouter.get("/brand/:brandId", ProductController.getProductsByBrandController);
ProductRouter.get("/search", ProductController.searchProductsController);

module.exports = ProductRouter;
