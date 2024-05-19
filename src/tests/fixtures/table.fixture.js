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
exports.insertTheTable = exports.tempTable = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const auth_fixture_1 = require("./auth.fixture");
const restaurant_fixture_1 = require("./restaurant.fixture");
const floor_fixture_1 = require("./floor.fixture");
const table_1 = require("../../api/models/table");
exports.tempTable = {
    number: 1,
    _id: new mongoose_1.default.Types.ObjectId(),
    userId: auth_fixture_1.tempUser._id,
    restaurantId: restaurant_fixture_1.tempRestaurant._id,
    floorId: floor_fixture_1.tempFloor._id,
};
const insertTheTable = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, restaurant_fixture_1.insertRestaurants)([restaurant_fixture_1.tempRestaurant]);
    yield (0, floor_fixture_1.insertTheFloor)();
    yield table_1.Table.insertMany([exports.tempTable]);
});
exports.insertTheTable = insertTheTable;
