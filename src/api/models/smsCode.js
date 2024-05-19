"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.smscode = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const smsCodeSchema = new mongoose_1.default.Schema({
    phone: { type: String, unique: true, required: true },
    code: { type: String },
    createdAt: { type: Date, expires: 120 },
});
exports.smscode = mongoose_1.default.model("smscodes", smsCodeSchema);
