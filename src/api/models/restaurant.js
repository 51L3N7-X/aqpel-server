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
exports.Restaurant = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const toJson_1 = require("./plugins/toJson");
const ApiError_1 = require("../utils/ApiError");
const restaurantSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
    currency: String,
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    menus: {
        type: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Menu" }],
        private: true,
    },
});
restaurantSchema.plugin(toJson_1.toJSON);
restaurantSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const restaurant = this; // refers to the current restaurant being saved
        const duplicate = yield exports.Restaurant.findOne({
            name: restaurant.name,
            userId: restaurant.userId,
        });
        if (duplicate && duplicate._id.toString() !== restaurant._id.toString())
            throw new ApiError_1.ApiError(400, "User already has a restaurant with the same name");
        next();
    });
});
exports.Restaurant = mongoose_1.default.model("Restaurant", restaurantSchema);
