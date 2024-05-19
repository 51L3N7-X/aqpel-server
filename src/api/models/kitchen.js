"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kitchen = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const toJson_1 = require("./plugins/toJson");
const Schema = mongoose_1.default.Schema;
const kitchenSchema = new mongoose_1.default.Schema({
    restaurant_name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
});
kitchenSchema.plugin(toJson_1.toJSON);
exports.Kitchen = mongoose_1.default.model("Kitchen", kitchenSchema);
