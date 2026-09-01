const express = require("express");
const CategoryController = require("./category.controller");
const { upload } = require("../../middlewares/uploadMiddleware");
const loadResource = require("../../middlewares/loadResource.middleware");
const CategoryModel = require("../../models/category.model");
const categoryRouter = express.Router();

categoryRouter.get("/tree", CategoryController.getCateoriesTreeController);
categoryRouter.get("/", CategoryController.getAllCategoriesController);
categoryRouter.post("/", upload.single("image"), CategoryController.createCategoryController);
categoryRouter.patch("/:id", loadResource(CategoryModel), upload.single("image"), CategoryController.updateCategoryController);
categoryRouter.delete("/:id", loadResource(CategoryModel), CategoryController.deleteCategoryController);

module.exports = categoryRouter;
