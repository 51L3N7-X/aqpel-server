"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.errorConverter = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = require("../utils/ApiError");
const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError_1.ApiError)) {
        const statusCode = error.statusCode || error instanceof mongoose_1.default.Error
            ? http_status_1.default.BAD_REQUEST
            : http_status_1.default.INTERNAL_SERVER_ERROR;
        const message = error.message || http_status_1.default[statusCode];
        const errors = error.errors || [];
        error = new ApiError_1.ApiError(statusCode, message, errors, false, err.stack);
    }
    next(error);
};
exports.errorConverter = errorConverter;
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    let { statusCode, message, errors } = err;
    //   if (config.env === "production" && !err.isOperational) {
    //     statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    //     message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
    //   }
    res.locals.errorMessage = err.message;
    const response = Object.assign({ success: false, code: statusCode, message,
        errors }, ((process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "test") && { stack: err.stack }));
    res.status(statusCode).send(response);
};
exports.errorHandler = errorHandler;
