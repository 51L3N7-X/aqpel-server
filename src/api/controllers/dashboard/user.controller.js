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
exports.deleteUser = exports.modifyUser = exports.getUser = void 0;
const user_1 = require("../../models/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const catchAsync_1 = require("../../utils/catchAsync");
const ApiError_1 = require("../../utils/ApiError");
exports.getUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.User.findById(req.user.id).lean();
    if (user) {
        Object.defineProperty(user, "password", {
            enumerable: false,
        });
    }
    res.send(user || {});
}));
exports.modifyUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.User.findByIdAndUpdate(req.user.id, req.body, {
        new: true,
    });
    if (!user)
        throw new ApiError_1.ApiError(404, "user not found.");
    if (req.body.password) {
        const hashedPassword = yield bcrypt_1.default.hash(req.body.password, 10);
        user.password = hashedPassword;
    }
    yield user.save();
    return res.send(Object.assign({ success: true }, user.toObject()));
}));
exports.deleteUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_1.User.findByIdAndDelete(req.user.id);
    res.send({ success: true });
}));
