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
exports.deleteItem = exports.modifyItem = exports.getItems = exports.getIndivItem = exports.addItem = void 0;
const item_1 = require("../../models/item");
const category_1 = require("../../models/category");
const catchAsync_1 = require("../../utils/catchAsync");
const ApiError_1 = require("../../utils/ApiError");
const http_status_1 = __importDefault(require("http-status"));
exports.addItem = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_1.Category.findOne({
        userId: req.user.id,
        _id: req.params.categoryId,
    });
    if (!category)
        throw new ApiError_1.ApiError(http_status_1.default.NOT_FOUND, "Category not found");
    const item = new item_1.Item(Object.assign({ userId: req.user.id, categoryId: req.params.categoryId, restaurantId: req.params.restaurantId }, req.body));
    category.items.push(item._id);
    yield item.save();
    yield category.save();
    res.status(201).send(item);
}));
exports.getIndivItem = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield item_1.Item.findOne({
        _id: req.params.itemId,
        userId: req.user.id,
    });
    if (!item)
        throw new ApiError_1.ApiError(http_status_1.default.NOT_FOUND, "Item not found");
    return res.send(item);
}));
exports.getItems = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const items = yield item_1.Item.find({
        userId: req.user.id,
        categoryId: req.params.categoryId,
    });
    if (!items.length)
        throw new ApiError_1.ApiError(http_status_1.default.NOT_FOUND, "Items not found");
    return res.send(items);
}));
exports.modifyItem = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield item_1.Item.findOne({
        userId: req.user.id,
        _id: req.params.itemId,
    });
    if (!item)
        throw new ApiError_1.ApiError(http_status_1.default.NOT_FOUND, "Item not found");
    Object.assign(item, req.body);
    yield item.save();
    return res.send(item);
}));
exports.deleteItem = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield item_1.Item.deleteOne({
        _id: req.params.itemId,
        userId: req.user.id,
    });
    yield category_1.Category.updateOne({ _id: req.params.categoryId }, { $pull: { items: req.params.itemId } });
    return res.send({ success: true });
}));
