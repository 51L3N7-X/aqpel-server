"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const toJson_1 = require("./plugins/toJson");
const Schema = mongoose_1.default.Schema;
const categorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
    userId: { type: Schema.Types.ObjectId, required: true },
    menuId: { type: Schema.Types.ObjectId, required: true },
    imageUrl: {
        type: String,
    },
    description: String,
    restaurantId: { type: Schema.Types.ObjectId },
});
categorySchema.plugin(toJson_1.toJSON);
exports.Category = mongoose_1.default.model("Category", categorySchema);
