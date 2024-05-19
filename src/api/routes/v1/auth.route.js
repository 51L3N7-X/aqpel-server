"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../../controllers/dashboard/auth.controller");
const validate_1 = require("../../middlewares/validate");
const public_1 = require("../../validations/public");
exports.router = express_1.default.Router();
exports.router.post("/register", (0, validate_1.validate)(public_1.registerValidate), auth_controller_1.register);
exports.router.post("/login", (0, validate_1.validate)(public_1.loginValidate), auth_controller_1.login);
exports.router.post("/logout", (0, validate_1.validate)(public_1.logoutValidate), auth_controller_1.logout);
exports.router.post("/refresh-tokens", (0, validate_1.validate)(public_1.refreshTokenValidate), auth_controller_1.refreshTokens);
