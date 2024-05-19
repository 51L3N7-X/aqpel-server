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
exports.tempItem = exports.tempCategory = exports.tempMenu = exports.tempRestaurant = exports.insertItems = exports.insertCategories = exports.insertMenu = exports.insertRestaurants = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const restaurant_1 = require("../../api/models/restaurant");
const faker_1 = require("@faker-js/faker");
const auth_fixture_1 = require("./auth.fixture");
const menu_1 = require("../../api/models/menu");
const category_1 = require("../../api/models/category");
const item_1 = require("../../api/models/item");
const insertRestaurants = (restaurants) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser]);
    yield restaurant_1.Restaurant.insertMany(restaurants);
});
exports.insertRestaurants = insertRestaurants;
const insertMenu = (menu) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.insertRestaurants)([exports.tempRestaurant]);
    yield menu_1.Menu.insertMany(menu);
});
exports.insertMenu = insertMenu;
const insertCategories = (categories) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.insertMenu)([exports.tempMenu]);
    yield category_1.Category.insertMany(categories);
});
exports.insertCategories = insertCategories;
const insertItems = (items) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.insertCategories)([exports.tempCategory]);
    yield item_1.Item.insertMany(items);
});
exports.insertItems = insertItems;
exports.tempRestaurant = {
    _id: new mongoose_1.default.Types.ObjectId(),
    name: faker_1.faker.person.firstName().toLocaleLowerCase(),
    userId: auth_fixture_1.tempUser._id,
};
exports.tempMenu = {
    _id: new mongoose_1.default.Types.ObjectId(),
    name: faker_1.faker.person.firstName(),
    userId: auth_fixture_1.tempUser._id,
    restaurantId: exports.tempRestaurant._id,
};
exports.tempCategory = {
    _id: new mongoose_1.default.Types.ObjectId(),
    name: faker_1.faker.person.firstName(),
    userId: auth_fixture_1.tempUser._id,
    restaurantId: exports.tempRestaurant._id,
    menuId: exports.tempMenu._id,
};
exports.tempItem = {
    _id: new mongoose_1.default.Types.ObjectId(),
    name: faker_1.faker.person.firstName(),
    userId: auth_fixture_1.tempUser._id,
    price: faker_1.faker.finance.amount(),
    restaurantId: exports.tempRestaurant._id,
    menuId: exports.tempMenu._id,
    categoryId: exports.tempCategory._id,
};
