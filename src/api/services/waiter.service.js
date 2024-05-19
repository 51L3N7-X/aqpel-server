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
exports.deleteWaiterById = exports.updateWaiterById = exports.getUserWaiters = exports.getWaiterById = exports.createWaiter = void 0;
const http_status_1 = __importDefault(require("http-status"));
const waiter_1 = require("../models/waiter");
const ApiError_1 = require("../utils/ApiError");
const restaurant_1 = require("../models/restaurant");
const createWaiter = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurant = yield restaurant_1.Restaurant.findOne({
        _id: body.restaurantId,
        userId: body.userId,
    });
    if (!restaurant || !Object.keys(restaurant).length)
        throw new ApiError_1.ApiError(http_status_1.default.BAD_REQUEST, "Restaurant not found");
    const waiter = yield waiter_1.Waiter.create(body);
    return waiter;
});
exports.createWaiter = createWaiter;
const getWaiterById = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const waiter = yield waiter_1.Waiter.findOne({ _id: id, userId });
    if (!waiter || !Object.keys(waiter).length)
        throw new ApiError_1.ApiError(404, "Waiter not found");
    return waiter;
});
exports.getWaiterById = getWaiterById;
const getUserWaiters = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return waiter_1.Waiter.find({ userId }).sort();
});
exports.getUserWaiters = getUserWaiters;
const updateWaiterById = (id, userId, body) => __awaiter(void 0, void 0, void 0, function* () {
    const waiter = yield waiter_1.Waiter.findOne({ userId, _id: id });
    if (!waiter || !Object.keys(waiter).length)
        throw new ApiError_1.ApiError(http_status_1.default.NOT_FOUND, "Waiter not found");
    const restaurant = yield restaurant_1.Restaurant.findOne({
        _id: body.restaurantId,
        userId,
    });
    if (!restaurant || !Object.keys(restaurant).length)
        throw new ApiError_1.ApiError(http_status_1.default.BAD_REQUEST, "Restaurant not found");
    Object.assign(waiter, body);
    yield waiter.save();
    return waiter;
});
exports.updateWaiterById = updateWaiterById;
const deleteWaiterById = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const waiter = yield waiter_1.Waiter.findOne({ userId, _id: id });
    if (!waiter || !Object.keys(waiter).length)
        throw new ApiError_1.ApiError(http_status_1.default.NOT_FOUND, "Waiter not found");
    yield waiter.deleteOne();
    return waiter;
});
exports.deleteWaiterById = deleteWaiterById;
