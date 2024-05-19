"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorObject = exports.ApiError = void 0;
class ApiError extends Error {
    constructor(statusCode, message, errors = [], isOperational = true, stack = "") {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.success = false;
        if (errors) {
            this.errors = errors;
        }
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.ApiError = ApiError;
class ErrorObject {
    constructor(type, message) {
        this.type = type;
        this.message = message;
    }
}
exports.ErrorObject = ErrorObject;
