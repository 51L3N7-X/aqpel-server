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
exports.deleteRestaurant = exports.modifyRestaurant = exports.getIndividualRestaurant = exports.getRestaurants = exports.addRestaurant = void 0;
const restaurant_1 = require("../../models/restaurant");
const catchAsync_1 = require("../../utils/catchAsync");
const ApiError_1 = require("../../utils/ApiError");
const http_status_1 = __importDefault(require("http-status"));
const restaurant_service_1 = require("../../services/restaurant.service");
exports.addRestaurant = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const check = await Restaurant.findOne({ userId: req.user.id });
    // if (check) throw new ApiError(409, "Restaurant Created Already");
    const restaurant = yield new restaurant_1.Restaurant(Object.assign({ userId: req.user.id }, req.body));
    yield restaurant.save();
    return res.status(http_status_1.default.CREATED).json(restaurant);
}));
exports.getRestaurants = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurant = yield restaurant_1.Restaurant.find({
        userId: req.user.id,
    });
    if (!restaurant)
        throw new ApiError_1.ApiError(http_status_1.default.NOT_FOUND, "Restaurant not found");
    return res.status(200).json(restaurant);
}));
exports.getIndividualRestaurant = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurant = yield restaurant_1.Restaurant.findOne({
        _id: req.params.restaurantId,
        userId: req.user.id,
    });
    if (!restaurant)
        throw new ApiError_1.ApiError(http_status_1.default.NOT_FOUND, "Restaurant not found");
    return res.status(200).json(restaurant);
}));
exports.modifyRestaurant = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurant = yield (0, restaurant_service_1.updateRestaurantById)(req.params.restaurantId, req.user.id, req.body);
    return res.send(restaurant);
}));
exports.deleteRestaurant = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurant = yield restaurant_1.Restaurant.findOne({
        userId: req.user.id,
        _id: req.params.restaurantId,
    }).populate({
        path: "menus",
        populate: {
            path: "categories",
            populate: {
                path: "items",
            },
        },
    });
    if (!restaurant)
        throw new ApiError_1.ApiError(404, "Restaurant not found.");
    if (restaurant.menus) {
        for (let menu of restaurant.menus) {
            //@ts-ignore
            if (menu.categories) {
                //@ts-ignore
                for (let category of menu.categories) {
                    if (category.items) {
                        for (let item of category.items) {
                            yield item.deleteOne();
                        }
                    }
                    yield category.deleteOne();
                }
            }
            //@ts-ignore
            yield menu.deleteOne();
        }
    }
    yield restaurant.deleteOne();
    return res.send({ success: true });
}));
