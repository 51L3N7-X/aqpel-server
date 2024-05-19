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
exports.Menu = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const toJson_1 = require("./plugins/toJson");
const ApiError_1 = require("../utils/ApiError");
const menuSchema = new mongoose_1.default.Schema({
    categories: {
        type: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Category" }],
        private: true,
    },
    name: {
        type: String,
        required: true,
    },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    restaurantId: { type: mongoose_1.default.Schema.ObjectId, required: true },
    imageUrl: String,
});
menuSchema.plugin(toJson_1.toJSON);
menuSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const menu = this; // refers to the current restaurant being saved
        const duplicate = yield exports.Menu.findOne({
            name: menu.name,
            userId: menu.userId,
        });
        if (duplicate && duplicate._id.toString() !== menu._id.toString())
            throw new ApiError_1.ApiError(400, "User already has a menu with the same name");
        next();
    });
});
exports.Menu = mongoose_1.default.model("Menu", menuSchema);
