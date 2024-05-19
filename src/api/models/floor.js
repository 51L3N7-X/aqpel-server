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
exports.Floor = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const toJson_1 = require("./plugins/toJson");
const ApiError_1 = require("../utils/ApiError");
const floorSchema = new mongoose_1.default.Schema({
    number: String,
    tables: {
        type: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Table" }],
        private: true,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
});
floorSchema.plugin(toJson_1.toJSON);
floorSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const floor = this;
        const exist = yield exports.Floor.findOne({
            number: floor.number,
            userId: floor.userId,
            //@ts-ignore
            _id: { $ne: floor._id },
        });
        if (exist)
            throw new ApiError_1.ApiError(400, "Floor with the same number already exists");
        return next();
    });
});
exports.Floor = mongoose_1.default.model("Floor", floorSchema);
