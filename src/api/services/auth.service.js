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
exports.refreshAuth = exports.logout = void 0;
const http_status_1 = __importDefault(require("http-status"));
const tokens_1 = require("../constants/tokens");
const token_1 = require("../models/token");
const ApiError_1 = require("../utils/ApiError");
const _1 = require(".");
const user_1 = require("../models/user");
const logout = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshTokenDoc = yield token_1.Token.findOne({
        token: refreshToken,
        type: tokens_1.tokenTypes.REFRESH,
        blacklisted: false,
    });
    if (!refreshTokenDoc)
        throw new ApiError_1.ApiError(http_status_1.default.NOT_FOUND, "Not Found");
    yield (refreshTokenDoc === null || refreshTokenDoc === void 0 ? void 0 : refreshTokenDoc.deleteOne());
});
exports.logout = logout;
const refreshAuth = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshTokenDoc = yield _1.tokenService.verifyToken(refreshToken, tokens_1.tokenTypes.REFRESH);
        if (!refreshTokenDoc)
            throw new ApiError_1.ApiError(http_status_1.default.UNAUTHORIZED, "Unauthorized");
        const user = yield user_1.User.findById(refreshTokenDoc.userId);
        if (!user || !Object.keys(user).length)
            throw new ApiError_1.ApiError(http_status_1.default.NOT_FOUND, "User not found with that token, Please login");
        yield refreshTokenDoc.deleteOne();
        return yield _1.tokenService.generateAuthTokens(user);
    }
    catch (error) {
        throw new ApiError_1.ApiError(http_status_1.default.UNAUTHORIZED, "Please authenticate");
    }
});
exports.refreshAuth = refreshAuth;
