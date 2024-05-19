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
exports.auth = void 0;
const passport_1 = __importDefault(require("passport"));
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = require("../utils/ApiError");
const verifyCallback = (req, resolve, reject) => (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
    if (err || info || !user) {
        if (info === null || info === void 0 ? void 0 : info.toString().includes("TokenExpiredError"))
            return reject(new ApiError_1.ApiError(http_status_1.default.UNAUTHORIZED, "expired"));
        return reject(new ApiError_1.ApiError(http_status_1.default.UNAUTHORIZED, "Please authenticate"));
    }
    req.user = user;
    resolve();
});
const auth = () => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        passport_1.default.authenticate("jwt", { session: false }, verifyCallback(req, resolve, reject))(req, res, next);
    })
        .then(() => next())
        .catch((err) => next(err));
});
exports.auth = auth;
