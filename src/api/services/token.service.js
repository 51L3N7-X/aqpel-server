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
exports.generateAuthTokens = exports.verifyToken = exports.saveToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const http_status_1 = __importDefault(require("http-status"));
const token_1 = require("../models/token");
const ApiError_1 = require("../utils/ApiError");
const config_1 = require("../config/config");
const tokens_1 = require("../constants/tokens");
const generateToken = (userId, expires, type, secret = config_1.config.jwt.secret) => {
    const payload = {
        sub: userId,
        iat: (0, moment_1.default)().unix(),
        exp: expires.unix(),
        type,
    };
    return jsonwebtoken_1.default.sign(payload, secret);
};
exports.generateToken = generateToken;
const saveToken = (token, userId, expires, type, blacklisted = false) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenDoc = yield token_1.Token.create({
        token,
        userId,
        expires: expires.toDate(),
        type,
        blacklisted,
    });
    return tokenDoc;
});
exports.saveToken = saveToken;
const verifyToken = (token, type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = jsonwebtoken_1.default.verify(token, config_1.config.jwt.secret);
        const tokenDoc = yield token_1.Token.findOne({
            token,
            type,
            userId: payload.sub,
            blacklisted: false,
        });
        if (!tokenDoc || !Object.keys(tokenDoc).length) {
            throw new Error("Token not found");
        }
        return tokenDoc;
    }
    catch (error) {
        throw new ApiError_1.ApiError(http_status_1.default.UNAUTHORIZED, "Please authenticate");
    }
});
exports.verifyToken = verifyToken;
const generateAuthTokens = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const accessTokenExpires = (0, moment_1.default)().add(config_1.config.jwt.accessExpirationMinutes, "minutes");
    const accessToken = (0, exports.generateToken)(user.id, accessTokenExpires, tokens_1.tokenTypes.ACCESS);
    const refreshTokenExpires = (0, moment_1.default)().add(config_1.config.jwt.refreshExpirationDays, "days");
    const refreshToken = (0, exports.generateToken)(user.id, refreshTokenExpires, tokens_1.tokenTypes.REFRESH);
    yield (0, exports.saveToken)(refreshToken, user.id, refreshTokenExpires, tokens_1.tokenTypes.REFRESH);
    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate(),
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate(),
        },
    };
});
exports.generateAuthTokens = generateAuthTokens;
