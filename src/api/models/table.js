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
exports.Table = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const toJson_1 = require("./plugins/toJson");
const ApiError_1 = require("../utils/ApiError");
const tableSchema = new mongoose_1.default.Schema({
    number: {
        type: String,
        required: true,
    },
    chairs: {
        type: String,
        default: "2",
    },
    shape: {
        type: String,
        default: "square",
    },
    restaurantId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "Restaurant",
    },
    restaurant_name: {
        type: String,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    floorId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
});
tableSchema.plugin(toJson_1.toJSON);
tableSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const table = this;
        const exist = yield exports.Table.findOne({
            number: table.number,
            userId: table.userId,
            floorId: table.floorId,
            //@ts-ignore
            _id: { $ne: table._id },
        });
        if (exist)
            throw new ApiError_1.ApiError(400, "Table with the same number already exists");
        return next();
    });
});
exports.Table = mongoose_1.default.model("Table", tableSchema);
