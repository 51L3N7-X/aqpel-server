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
exports.deleteKitchen = exports.modifyKitchen = exports.getTheKitchen = exports.addKitchen = void 0;
const restaurant_1 = require("../../models/restaurant");
const kitchen_1 = require("../../models/kitchen");
const catchAsync_1 = require("../../utils/catchAsync");
const ApiError_1 = require("../../utils/ApiError");
exports.addKitchen = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurant = yield restaurant_1.Restaurant.findOne({ userId: req.user.id });
    if (!restaurant)
        throw new ApiError_1.ApiError(404, "Restaurnat not found.");
    const kitchen = yield new kitchen_1.Kitchen(Object.assign({ userId: req.user.id, restaurant_name: restaurant.name }, req.body));
    yield kitchen.save();
    return res.status(200).json(kitchen);
}));
exports.getTheKitchen = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const kitchen = yield kitchen_1.Kitchen.findOne({
        userId: req.user.id,
    });
    return res.status(200).json(kitchen || {});
}));
exports.modifyKitchen = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const kitchen = yield kitchen_1.Kitchen.findOneAndUpdate({ userId: req.user.id }, req.body, { new: true });
    if (!kitchen)
        throw new ApiError_1.ApiError(404, "Kitchen not found.");
    return res.status(200).json(Object.assign({ success: true }, kitchen.toObject()));
}));
exports.deleteKitchen = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield kitchen_1.Kitchen.deleteOne({
        userId: req.user.id,
    });
    return res.send({ success: true });
}));
