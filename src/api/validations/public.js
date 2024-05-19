"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.waiterGetOrDeleteValidate = exports.waiterModifyValidate = exports.waiterCreateValidate = exports.tableDeleteValidate = exports.tableGetValidate = exports.tableModifyValidate = exports.tableCreateValidate = exports.floorDeleteValidate = exports.floorGetValidate = exports.floorModifyValidate = exports.floorCreateValidate = exports.itemModifyValidate = exports.itemGetValidate = exports.itemCreateValidate = exports.categoryDeleteValidate = exports.categoryModifyValidate = exports.categoryGetValidate = exports.categoryCreateValidate = exports.restaurantGetOrDeleteValidate = exports.restaurantUpdateValidate = exports.restaurantCreateValidate = exports.menuDeleteValidate = exports.menuModifyValidate = exports.menuGetValidate = exports.menuCreateValidate = exports.refreshTokenValidate = exports.logoutValidate = exports.loginValidate = exports.registerValidate = exports.orderValidate = void 0;
const custom_1 = require("./utils/custom");
const joi_1 = __importDefault(require("joi"));
// import JoiPhone from "joi-phone-number";
// const test = Joi.extend(JoiPhone);
exports.orderValidate = {
    body: joi_1.default.object().keys({
        type: joi_1.default.string().required().valid("order", "waiter", "ember", "bill"),
        restaurant_id: joi_1.default.string().required(),
        table_id: joi_1.default.string().required().custom(custom_1.objectId),
        // table_number: Joi.number().required(),
        order_details: joi_1.default.object({
            price: joi_1.default.string().required(),
        }).optional(),
    }),
};
//register
exports.registerValidate = {
    body: joi_1.default.object().keys({
        username: joi_1.default.string().required().min(3).max(20).trim().lowercase(),
        email: joi_1.default.string().required().email(),
        password: joi_1.default.string().required().custom(custom_1.password),
        // phone: test.string().phoneNumber({ format: "e164" }).required(),
    }),
};
//login
exports.loginValidate = {
    body: joi_1.default.object().keys({
        email: joi_1.default.string().required().email(),
        password: joi_1.default.string().required().custom(custom_1.password),
    }),
};
//logout
exports.logoutValidate = {
    body: joi_1.default.object().keys({
        refreshToken: joi_1.default.string().required(),
    }),
};
//refresh
exports.refreshTokenValidate = {
    body: joi_1.default.object().keys({
        refreshToken: joi_1.default.string().required(),
    }),
};
//menu
exports.menuCreateValidate = {
    body: joi_1.default.object().keys({
        name: joi_1.default.string().min(1).required().max(20),
        categories: joi_1.default.forbidden(),
        imageUrl: joi_1.default.string(),
    }),
    params: joi_1.default.object()
        .keys({
        restaurantId: joi_1.default.required().custom(custom_1.objectId),
    })
        .required(),
};
exports.menuGetValidate = {
    params: joi_1.default.object().keys({
        restaurantId: joi_1.default.required().custom(custom_1.objectId),
        menuId: joi_1.default.required().custom(custom_1.objectId),
    }),
};
exports.menuModifyValidate = {
    body: joi_1.default.object().keys({
        name: joi_1.default.string().min(1),
        categories: joi_1.default.forbidden(),
        imageUrl: joi_1.default.string(),
    }),
    params: exports.menuGetValidate.params,
};
exports.menuDeleteValidate = {
    params: exports.menuGetValidate.params,
};
//restaurant
exports.restaurantCreateValidate = {
    body: joi_1.default.object().keys({
        name: joi_1.default.string().required().max(20).min(1),
        currency: joi_1.default.string(),
        description: joi_1.default.string(),
        menus: joi_1.default.forbidden(),
        imageUrl: joi_1.default.string(),
    }),
};
exports.restaurantUpdateValidate = {
    params: joi_1.default.object().keys({
        restaurantId: joi_1.default.required().custom(custom_1.objectId),
    }),
    body: joi_1.default.object().keys({
        name: joi_1.default.string().max(20).min(1),
        currency: joi_1.default.string(),
        description: joi_1.default.string(),
        menus: joi_1.default.forbidden(),
        imageUrl: joi_1.default.string(),
    }),
};
exports.restaurantGetOrDeleteValidate = {
    params: exports.restaurantUpdateValidate.params,
};
//categories
exports.categoryCreateValidate = {
    params: joi_1.default.object().keys({
        restaurantId: joi_1.default.required().custom(custom_1.objectId),
        menuId: joi_1.default.required().custom(custom_1.objectId),
    }),
    body: joi_1.default.object().keys({
        name: joi_1.default.string().required().max(20).min(1),
        description: joi_1.default.string().max(500),
        items: joi_1.default.forbidden(),
        imageUrl: joi_1.default.string(),
    }),
};
exports.categoryGetValidate = {
    params: joi_1.default.object().keys({
        restaurantId: joi_1.default.required().custom(custom_1.objectId),
        menuId: joi_1.default.required().custom(custom_1.objectId),
        categoryId: joi_1.default.required().custom(custom_1.objectId),
    }),
};
exports.categoryModifyValidate = {
    params: exports.categoryGetValidate.params,
    body: joi_1.default.object().keys({
        name: joi_1.default.string().max(20),
        description: joi_1.default.object().max(500),
        items: joi_1.default.forbidden(),
    }),
};
exports.categoryDeleteValidate = {
    params: exports.categoryGetValidate.params,
};
//items
exports.itemCreateValidate = {
    params: joi_1.default.object().keys({
        restaurantId: joi_1.default.required().custom(custom_1.objectId),
        menuId: joi_1.default.required().custom(custom_1.objectId),
        categoryId: joi_1.default.required().custom(custom_1.objectId),
    }),
    body: joi_1.default.object().keys({
        name: joi_1.default.string().required().min(3).max(20),
        price: joi_1.default.number().required().max(999),
        description: joi_1.default.string().max(500).optional().allow(""),
        calories: joi_1.default.number().max(99999).optional().allow(""),
        people: joi_1.default.number().max(10).optional().allow(""),
        imageUrl: joi_1.default.string(),
        new: joi_1.default.boolean(),
        special: joi_1.default.boolean(),
    }),
};
exports.itemGetValidate = {
    params: joi_1.default.object().keys({
        restaurantId: joi_1.default.required().custom(custom_1.objectId),
        menuId: joi_1.default.required().custom(custom_1.objectId),
        categoryId: joi_1.default.required().custom(custom_1.objectId),
        itemId: joi_1.default.required().custom(custom_1.objectId),
    }),
};
exports.itemModifyValidate = {
    params: joi_1.default.object().keys({
        restaurantId: joi_1.default.required().custom(custom_1.objectId),
        menuId: joi_1.default.required().custom(custom_1.objectId),
        categoryId: joi_1.default.required().custom(custom_1.objectId),
        itemId: joi_1.default.required().custom(custom_1.objectId),
    }),
    body: joi_1.default.object().keys({
        name: joi_1.default.string().min(3).max(20),
        price: joi_1.default.number().max(999),
        description: joi_1.default.string().max(500),
        calories: joi_1.default.number().max(99),
        imageUrl: joi_1.default.string(),
        new: joi_1.default.boolean(),
        people: joi_1.default.number().max(99),
        special: joi_1.default.boolean(),
    }),
};
//floors
exports.floorCreateValidate = {
    body: joi_1.default.object().keys({
        number: joi_1.default.number().required().max(99).min(0),
        tables: joi_1.default.forbidden(),
    }),
};
exports.floorModifyValidate = {
    params: joi_1.default.object().keys({
        floorId: joi_1.default.string().required(),
    }),
    body: joi_1.default.object().keys({
        number: joi_1.default.number().max(99).min(1),
        tables: joi_1.default.forbidden(),
    }),
};
exports.floorGetValidate = {
    params: joi_1.default.object().keys({
        floorId: joi_1.default.custom(custom_1.objectId).required(),
    }),
};
exports.floorDeleteValidate = {
    params: joi_1.default.object().keys({
        floorId: joi_1.default.custom(custom_1.objectId).required(),
    }),
};
//tables
exports.tableCreateValidate = {
    body: joi_1.default.object().keys({
        number: joi_1.default.number().min(1).max(99).required(),
        chairs: joi_1.default.number().min(1).max(8).default(2),
        shape: joi_1.default.string().valid("square", "circle").default("square"),
        restaurantId: joi_1.default.string().custom(custom_1.objectId).required(),
        restaurant_name: joi_1.default.string(),
    }),
    params: joi_1.default.object().keys({
        floorId: joi_1.default.custom(custom_1.objectId).required(),
    }),
};
exports.tableModifyValidate = {
    body: joi_1.default.object().keys({
        number: joi_1.default.number().min(1).max(100),
        shape: joi_1.default.string().valid("square", "circle"),
        chairs: joi_1.default.number().min(1).max(6),
        restaurantId: joi_1.default.string().custom(custom_1.objectId).required(),
        restaurant_name: joi_1.default.string(),
    }),
    params: joi_1.default.object().keys({
        floorId: joi_1.default.custom(custom_1.objectId).required(),
        tableId: joi_1.default.custom(custom_1.objectId).required(),
    }),
};
exports.tableGetValidate = {
    params: joi_1.default.object().keys({
        floorId: joi_1.default.custom(custom_1.objectId).required(),
        tableId: joi_1.default.custom(custom_1.objectId).required(),
    }),
};
exports.tableDeleteValidate = {
    params: joi_1.default.object().keys({
        floorId: joi_1.default.custom(custom_1.objectId).required(),
        tableId: joi_1.default.custom(custom_1.objectId).required(),
    }),
};
// waiters
exports.waiterCreateValidate = {
    body: joi_1.default.object().keys({
        username: joi_1.default.string().required().trim().min(3).max(25).lowercase(),
        password: joi_1.default.custom(custom_1.password).required(),
        name: joi_1.default.string().trim(),
        photoUrl: joi_1.default.string(),
        restaurantId: joi_1.default.string().custom(custom_1.objectId).required(),
        active: joi_1.default.boolean(),
        tables: joi_1.default.array().items(joi_1.default.custom(custom_1.objectId)).unique(),
    }),
};
exports.waiterModifyValidate = {
    body: joi_1.default.object().keys({
        username: joi_1.default.string().trim().min(3).max(25).lowercase(),
        password: joi_1.default.custom(custom_1.password),
        name: joi_1.default.string().trim(),
        photoUrl: joi_1.default.string(),
        restaurantId: joi_1.default.string().custom(custom_1.objectId).required(),
        active: joi_1.default.boolean(),
        tables: joi_1.default.array().items(joi_1.default.custom(custom_1.objectId)).unique(),
    }),
};
exports.waiterGetOrDeleteValidate = {
    params: joi_1.default.object().keys({
        waiterId: joi_1.default.custom(custom_1.objectId).required(),
    }),
};
