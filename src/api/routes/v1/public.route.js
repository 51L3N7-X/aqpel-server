"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const getTables_controller_1 = require("../../controllers/public/getTables.controller");
const order_controller_1 = require("../../controllers/public/order.controller");
const validate_1 = require("../../middlewares/validate");
const public_1 = require("../../validations/public");
const getItem_controller_1 = require("../../controllers/public/getItem.controller");
const getCategories_controller_1 = require("../../controllers/public/getCategories.controller");
exports.router = express_1.default.Router();
exports.router.post("/order", (0, validate_1.validate)(public_1.orderValidate), order_controller_1.postOrder);
exports.router.get("/:tableId", getTables_controller_1.getTableOnly);
exports.router.get("/:restaurantId/menu", getTables_controller_1.getMenu);
exports.router.get("/item/:itemId", getItem_controller_1.getItem);
exports.router.get("/:restaurantId/items", getItem_controller_1.getItems);
exports.router.get("/:restaurantId/categories", getCategories_controller_1.getCategories);
