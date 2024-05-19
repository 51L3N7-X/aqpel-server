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
exports.insertWaiter = exports.tempWaiter = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const auth_fixture_1 = require("./auth.fixture");
const waiter_1 = require("../../api/models/waiter");
const restaurant_fixture_1 = require("./restaurant.fixture");
exports.tempWaiter = {
    username: "username123",
    password: "password123$",
    _id: new mongoose_1.default.Types.ObjectId(),
    userId: auth_fixture_1.tempUser._id,
    restaurantId: restaurant_fixture_1.tempRestaurant._id,
};
const insertWaiter = (waiters) => __awaiter(void 0, void 0, void 0, function* () {
    yield waiter_1.Waiter.insertMany(waiters);
});
exports.insertWaiter = insertWaiter;
