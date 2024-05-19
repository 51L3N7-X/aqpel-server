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
exports.deleteMenu = exports.modifyMenu = exports.getIndivMenu = exports.getMenus = exports.addMenu = void 0;
const menu_1 = require("../../models/menu");
const restaurant_1 = require("../../models/restaurant");
const catchAsync_1 = require("../../utils/catchAsync");
const ApiError_1 = require("../../utils/ApiError");
const http_status_1 = __importDefault(require("http-status"));
exports.addMenu = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurant = yield restaurant_1.Restaurant.findOne({
        userId: req.user.id,
        _id: req.params.restaurantId,
    });
    if (!restaurant)
        throw new ApiError_1.ApiError(404, "Restaurant not found.");
    const menu = yield new menu_1.Menu(Object.assign({ restaurantId: req.params.restaurantId, userId: req.user.id }, req.body));
    restaurant.menus.push(menu._id);
    yield menu.save();
    yield restaurant.save();
    return res.status(http_status_1.default.CREATED).send(menu);
}));
exports.getMenus = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const menu = yield menu_1.Menu.find({
        restaurantId: req.params.restaurantId,
        userId: req.user.id,
    });
    if (!menu.length)
        throw new ApiError_1.ApiError(404, "Menu not found");
    return res.status(200).json(menu);
}));
exports.getIndivMenu = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const menu = yield menu_1.Menu.findOne({
        userId: req.user.id,
        _id: req.params.menuId,
        restaurantId: req.params.restaurantId,
    });
    if (!menu)
        throw new ApiError_1.ApiError(http_status_1.default.NOT_FOUND, "Menu not found");
    return res.send(menu);
}));
exports.modifyMenu = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const menu = yield menu_1.Menu.findOne({
        restaurantId: req.params.restaurantId,
        userId: req.user.id,
        _id: req.params.menuId,
    });
    if (!menu)
        throw new ApiError_1.ApiError(404, "menu not found.");
    Object.assign(menu, req.body);
    yield menu.save();
    return res.send(menu);
}));
exports.deleteMenu = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const menu = yield menu_1.Menu.findOne({
        restaurantId: req.params.restaurantId,
        userId: req.user.id,
    }).populate({
        path: "categories",
        populate: {
            path: "items",
        },
    });
    if (!menu)
        throw new ApiError_1.ApiError(404, "Menu not found.");
    for (let category of menu.categories) {
        //@ts-ignore
        for (let item of category.items) {
            yield item.deleteOne();
        }
        //@ts-ignore
        yield category.deleteOne();
    }
    yield menu.deleteOne();
    return res.send({ success: true });
}));
