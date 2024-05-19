"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.modifyCategory = exports.getIndivCategory = exports.getCategories = exports.addCategory = void 0;
const menu_1 = require("../../models/menu");
const category_1 = require("../../models/category");
const catchAsync_1 = require("../../utils/catchAsync");
const ApiError_1 = require("../../utils/ApiError");
const http_status_1 = __importDefault(require("http-status"));
exports.addCategory = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const menu = yield menu_1.Menu.findOne({
        _id: req.params.menuId,
        userId: req.user.id,
    });
    if (!menu)
        throw new ApiError_1.ApiError(http_status_1.default.NOT_FOUND, "Menu not found");
    const category = yield new category_1.Category(Object.assign({ userId: req.user.id, menuId: menu._id, restaurant_id: req.params.restaurantId }, req.body));
    menu.categories.push(category._id);
    yield category.save();
    yield menu.save();
    return res.status(http_status_1.default.CREATED).send(category);
}));
exports.getCategories = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield category_1.Category.find({
        menuId: req.params.menuId,
        userId: req.user.id,
    });
    if (!categories.length)
        throw new ApiError_1.ApiError(404, "Categories not found");
    return res.status(http_status_1.default.OK).send(categories);
}));
exports.getIndivCategory = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_1.Category.findOne({
        userId: req.user.id,
        _id: req.params.categoryId,
    });
    if (!category)
        throw new ApiError_1.ApiError(404, "Category not found");
    return res.send(category);
}));
exports.modifyCategory = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_1.Category.findOne({
        _id: req.params.categoryId,
        userId: req.user.id,
    });
    if (!category)
        throw new ApiError_1.ApiError(http_status_1.default.NOT_FOUND, "category not found.");
    Object.assign(category, req.body);
    yield category.save();
    res.send(category);
}));
exports.deleteCategory = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_1.Category.findOne({
        _id: req.params.categoryId,
        userId: req.user.id,
    }).populate("items");
    if (!category)
        throw new ApiError_1.ApiError(http_status_1.default.NOT_FOUND, "category not found.");
    for (let item of category.items) {
        //@ts-ignore
        yield item.deleteOne();
    }
    yield category.deleteOne();
    yield menu_1.Menu.updateOne({ _id: req.params.menuId }, { $pull: { categories: req.params.categoryId } });
    return res.status(http_status_1.default.NO_CONTENT).send();
}));
