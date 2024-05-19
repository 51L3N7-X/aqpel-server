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
exports.deleteFloorById = exports.updateFloorById = exports.getFloorByNumber = exports.getFloorsWithTables = exports.getUserFloors = exports.getFloorById = exports.createFloor = void 0;
const http_status_1 = __importDefault(require("http-status"));
const floor_1 = require("../models/floor");
const ApiError_1 = require("../utils/ApiError");
const createFloor = (body) => __awaiter(void 0, void 0, void 0, function* () {
    return floor_1.Floor.create(body);
});
exports.createFloor = createFloor;
const getFloorById = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const floor = yield floor_1.Floor.findOne({ _id: id, userId });
    if (!floor || !Object.keys(floor).length)
        throw new ApiError_1.ApiError(404, "Floor not found");
    return floor;
});
exports.getFloorById = getFloorById;
const getUserFloors = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const floor = yield floor_1.Floor.find({ userId })
        .sort({ number: 1 })
        .collation({ locale: "en_US", numericOrdering: true });
    return floor;
});
exports.getUserFloors = getUserFloors;
const getFloorsWithTables = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const floors = yield floor_1.Floor.find({ userId }).populate({
        path: "tables",
        select: {
            number: 1,
            id: 1,
        },
    });
    return floors;
});
exports.getFloorsWithTables = getFloorsWithTables;
const getFloorByNumber = (number, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const floor = yield floor_1.Floor.findOne({ number, userId });
    if (!floor || !Object.keys(floor).length)
        throw new ApiError_1.ApiError(404, "Floor not found");
    return floor;
});
exports.getFloorByNumber = getFloorByNumber;
const updateFloorById = (id, userId, body) => __awaiter(void 0, void 0, void 0, function* () {
    const floor = yield floor_1.Floor.findOne({ userId, _id: id });
    if (!floor || !Object.keys(floor).length)
        throw new ApiError_1.ApiError(http_status_1.default.NOT_FOUND, "Floor not found");
    Object.assign(floor, body);
    yield floor.save();
    return floor;
});
exports.updateFloorById = updateFloorById;
const deleteFloorById = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const floor = yield floor_1.Floor.findOne({ userId, _id: id });
    if (!floor || !Object.keys(floor).length)
        throw new ApiError_1.ApiError(http_status_1.default.NOT_FOUND, "Floor not found");
    yield floor.deleteOne();
    return floor;
});
exports.deleteFloorById = deleteFloorById;
