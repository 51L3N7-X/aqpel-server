"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const toJson_1 = require("./plugins/toJson");
const itemSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: String,
    calories: Number,
    people: Number,
    new: Boolean,
    special: Boolean,
    imageUrl: String,
    userId: { type: mongoose_2.Schema.Types.ObjectId },
    menuId: { type: mongoose_2.Schema.Types.ObjectId },
    categoryId: { type: mongoose_2.Schema.Types.ObjectId },
    restaurantId: { type: mongoose_2.Schema.Types.ObjectId, required: true },
});
itemSchema.plugin(toJson_1.toJSON);
exports.Item = mongoose_1.default.model("Item", itemSchema);
