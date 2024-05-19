"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
exports.router = express_1.default.Router();
const menu_controller_1 = require("../../controllers/dashboard/menu.controller");
const category_controller_1 = require("../../controllers/dashboard/category.controller");
const item_controller_1 = require("../../controllers/dashboard/item.controller");
const restaurant_controller_1 = require("../../controllers/dashboard/restaurant.controller");
const auth_1 = require("../../middlewares/auth");
const validate_1 = require("../../middlewares/validate");
const public_1 = require("../../validations/public");
exports.router.use((0, auth_1.auth)());
//restaurant
exports.router.post("/", (0, validate_1.validate)(public_1.restaurantCreateValidate), restaurant_controller_1.addRestaurant);
exports.router.get("/", restaurant_controller_1.getRestaurants);
exports.router.get("/:restaurantId", (0, validate_1.validate)(public_1.restaurantGetOrDeleteValidate), restaurant_controller_1.getIndividualRestaurant);
exports.router.patch("/:restaurantId", (0, validate_1.validate)(public_1.restaurantUpdateValidate), restaurant_controller_1.modifyRestaurant);
exports.router.delete("/:restaurantId", (0, validate_1.validate)(public_1.restaurantGetOrDeleteValidate), restaurant_controller_1.deleteRestaurant);
//menus
exports.router.post("/:restaurantId/menu", (0, validate_1.validate)(public_1.menuCreateValidate), menu_controller_1.addMenu);
exports.router.get("/:restaurantId/menu", menu_controller_1.getMenus);
exports.router.get("/:restaurantId/menu/:menuId", (0, validate_1.validate)(public_1.menuGetValidate), menu_controller_1.getIndivMenu);
exports.router.patch("/:restaurantId/menu/:menuId", (0, validate_1.validate)(public_1.menuModifyValidate), menu_controller_1.modifyMenu);
exports.router.delete("/:restaurantId/menu/:menuId", (0, validate_1.validate)(public_1.menuDeleteValidate), menu_controller_1.deleteMenu);
//categories
exports.router.post("/:restaurantId/menu/:menuId/category", (0, validate_1.validate)(public_1.categoryCreateValidate), category_controller_1.addCategory);
exports.router.get("/:restaurantId/menu/:menuId/category", category_controller_1.getCategories);
exports.router.get("/:restaurantId/menu/:menuId/category/:categoryId", (0, validate_1.validate)(public_1.categoryGetValidate), category_controller_1.getIndivCategory);
exports.router.patch("/:restaurantId/menu/:menuId/category/:categoryId", (0, validate_1.validate)(public_1.categoryModifyValidate), category_controller_1.modifyCategory);
exports.router.delete("/:restaurantId/menu/:menuId/category/:categoryId", (0, validate_1.validate)(public_1.categoryDeleteValidate), category_controller_1.deleteCategory);
//items
exports.router.post("/:restaurantId/menu/:menuId/category/:categoryId/item", (0, validate_1.validate)(public_1.itemCreateValidate), item_controller_1.addItem);
exports.router.get("/:restaurantId/menu/:menuId/category/:categoryId/item", item_controller_1.getItems);
exports.router.get("/:restaurantId/menu/:menuId/category/:categoryId/item/:itemId", (0, validate_1.validate)(public_1.itemGetValidate), item_controller_1.getIndivItem);
exports.router.patch("/:restaurantId/menu/:menuId/category/:categoryId/item/:itemId", (0, validate_1.validate)(public_1.itemModifyValidate), item_controller_1.modifyItem);
exports.router.delete("/:restaurantId/menu/:menuId/category/:categoryId/item/:itemId", (0, validate_1.validate)(public_1.itemGetValidate), item_controller_1.deleteItem);
