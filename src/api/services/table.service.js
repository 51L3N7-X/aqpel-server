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
exports.deleteTableById = exports.updateTableById = exports.getTableByNumber = exports.getUserTablesByFloor = exports.getTableById = exports.createTable = void 0;
const http_status_1 = __importDefault(require("http-status"));
const table_1 = require("../models/table");
const ApiError_1 = require("../utils/ApiError");
const restaurant_1 = require("../models/restaurant");
const createTable = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurant = yield restaurant_1.Restaurant.findOne({
        _id: body.restaurantId,
        userId: body.userId,
    });
    if (!restaurant || !Object.keys(restaurant).length)
        throw new ApiError_1.ApiError(http_status_1.default.BAD_REQUEST, "Restaurant not found");
    const table = yield table_1.Table.create(body);
    return table;
});
exports.createTable = createTable;
const getTableById = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const table = yield table_1.Table.findOne({ _id: id, userId });
    if (!table || !Object.keys(table).length)
        throw new ApiError_1.ApiError(404, "Table not found");
    return table;
});
exports.getTableById = getTableById;
const getUserTablesByFloor = (userId, floorId) => __awaiter(void 0, void 0, void 0, function* () {
    const table = yield table_1.Table.find({ userId, floorId })
        .sort({ number: 1 })
        .collation({ locale: "en_US", numericOrdering: true });
    return table;
});
exports.getUserTablesByFloor = getUserTablesByFloor;
const getTableByNumber = (number, userId, floorId) => __awaiter(void 0, void 0, void 0, function* () {
    const table = yield table_1.Table.findOne({ number, userId, floorId });
    if (!table || !Object.keys(table).length)
        throw new ApiError_1.ApiError(404, "Table not found");
    return table;
});
exports.getTableByNumber = getTableByNumber;
const updateTableById = (id, userId, body) => __awaiter(void 0, void 0, void 0, function* () {
    const table = yield table_1.Table.findOne({ userId, _id: id });
    if (!table || !Object.keys(table).length)
        throw new ApiError_1.ApiError(http_status_1.default.NOT_FOUND, "Table not found");
    const restaurant = yield restaurant_1.Restaurant.findOne({
        _id: body.restaurantId,
        userId,
    });
    if (!restaurant || !Object.keys(restaurant).length)
        throw new ApiError_1.ApiError(http_status_1.default.BAD_REQUEST, "Restaurant not found");
    Object.assign(table, body);
    yield table.save();
    return table;
});
exports.updateTableById = updateTableById;
const deleteTableById = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const table = yield table_1.Table.findOne({ userId, _id: id });
    if (!table || !Object.keys(table).length)
        throw new ApiError_1.ApiError(http_status_1.default.NOT_FOUND, "Table not found");
    yield table.deleteOne();
    return table;
});
exports.deleteTableById = deleteTableById;
