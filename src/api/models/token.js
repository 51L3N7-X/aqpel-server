"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const toJson_1 = require("./plugins/toJson");
const tokens_1 = require("../constants/tokens");
const tokenSchema = new mongoose_1.default.Schema({
    token: {
        type: String,
        required: true,
        index: true,
    },
    userId: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        enum: [
            tokens_1.tokenTypes.REFRESH,
            // tokenTypes.RESET_PASSWORD,
            // tokenTypes.VERIFY_EMAIL,
        ],
        required: true,
    },
    expires: {
        type: Date,
        required: true,
    },
    blacklisted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
tokenSchema.plugin(toJson_1.toJSON);
exports.Token = mongoose_1.default.model("Token", tokenSchema);
