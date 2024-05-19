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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItems = exports.getItem = void 0;
const item_1 = require("../../models/item");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
exports.getItem = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield item_1.Item.findOne({ _id: req.params.itemId });
    if (!item || Object.keys(item).length <= 0)
        throw new ApiError_1.ApiError(404, "Item not found");
    return res.send(item);
}));
exports.getItems = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params);
    const items = yield item_1.Item.find({ restaurantId: req.params.restaurantId });
    if (!items || !Object.keys(items).length)
        throw new ApiError_1.ApiError(404, "Items not found");
    return res.send(items);
}));
