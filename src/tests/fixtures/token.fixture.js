"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tempUser2AccessToken = exports.tempUserAccessToken = void 0;
const config_1 = require("../../api/config/config");
const moment_1 = __importDefault(require("moment"));
const services_1 = require("../../api/services");
const auth_fixture_1 = require("./auth.fixture");
const tokens_1 = require("../../api/constants/tokens");
const accessTokenExpires = (0, moment_1.default)().add(config_1.config.jwt.accessExpirationMinutes, "minutes");
exports.tempUserAccessToken = services_1.tokenService.generateToken(auth_fixture_1.tempUser._id, accessTokenExpires, tokens_1.tokenTypes.ACCESS);
exports.tempUser2AccessToken = services_1.tokenService.generateToken(auth_fixture_1.tempUser2._id, accessTokenExpires, tokens_1.tokenTypes.ACCESS);
