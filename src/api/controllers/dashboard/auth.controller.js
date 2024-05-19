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
exports.refreshTokens = exports.logout = exports.register = exports.login = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const ApiError_1 = require("../../utils/ApiError");
const user_1 = require("../../models/user");
const http_status_1 = __importDefault(require("http-status"));
const token_service_1 = require("../../services/token.service");
const services_1 = require("../../services");
exports.login = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers.authorization)
        throw new ApiError_1.ApiError(400, "Authenticated");
    const { email, password } = req.body;
    const errors = [];
    if (!email)
        errors.push(new ApiError_1.ErrorObject("email", "Content cannot be empty!"));
    if (!password)
        errors.push(new ApiError_1.ErrorObject("password", "Content cannot be empty!"));
    const user = yield user_1.User.findOne({
        email,
    });
    if (!user || !(yield user.isPasswordMatch(password))) {
        errors.push(new ApiError_1.ErrorObject("email", "The email or password you entered is incorrect. Please try again."));
        errors.push(new ApiError_1.ErrorObject("password", "The email or password you entered is incorrect. Please try again."));
    }
    if (errors.length > 0)
        throw new ApiError_1.ApiError(http_status_1.default.BAD_REQUEST, "Please try again", errors);
    const tokens = yield (0, token_service_1.generateAuthTokens)(user);
    return res.status(200).json({ success: true, tokens, user });
}));
exports.register = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    if (req.headers.authorization)
        throw new ApiError_1.ApiError(http_status_1.default.BAD_REQUEST, "Authenticated");
    const { email, password, username, phone, location, code } = req.body;
    const errors = [];
    if (yield user_1.User.isEmailTaken(email)) {
        errors.push(new ApiError_1.ErrorObject("email", `Sorry, ${email} email has already been taken. Please choose a different email.`));
    }
    if (yield user_1.User.isUserNameTaken(username))
        errors.push(new ApiError_1.ErrorObject("username", `Sorry, ${username} username has already been taken. Please choose a different username.`));
    // if (await User.isPhoneTaken(phone))
    //   errors.push({
    //     ...new ApiError(
    //       httpStatus.CONFLICT,
    //       `${phone} Phone number has already been registered. Please use a different phone number.`
    //     ),
    //     type: "phone",
    //   });
    if (errors.length > 0) {
        throw new ApiError_1.ApiError(http_status_1.default.CONFLICT, `Sorry try again`, errors);
    }
    const user = yield user_1.User.create(req.body);
    const tokens = yield (0, token_service_1.generateAuthTokens)(user);
    res.status(http_status_1.default.CREATED).json({ success: true, tokens, user });
}));
exports.logout = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield services_1.authService.logout(req.body.refreshToken);
    res.status(http_status_1.default.NO_CONTENT).send();
}));
exports.refreshTokens = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tokens = yield services_1.authService.refreshAuth(req.body.refreshToken);
    res.status(http_status_1.default.OK).send(tokens);
}));
