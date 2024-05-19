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
exports.updateRestaurantById = void 0;
const http_status_1 = __importDefault(require("http-status"));
const restaurant_1 = require("../models/restaurant");
const ApiError_1 = require("../utils/ApiError");
const updateRestaurantById = (id, userId, updateBody) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurant = yield restaurant_1.Restaurant.findOne({ _id: id, userId });
    if (!restaurant || !Object.keys(restaurant).length)
        throw new ApiError_1.ApiError(http_status_1.default.NOT_FOUND, "Restaurant not found");
    Object.assign(restaurant, updateBody);
    yield restaurant.save();
    return restaurant;
});
exports.updateRestaurantById = updateRestaurantById;
