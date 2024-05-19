"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const joi_1 = __importDefault(require("joi"));
const ApiError_1 = require("../utils/ApiError");
const pick_1 = require("../utils/pick");
const http_status_1 = __importDefault(require("http-status"));
const validate = (schema) => (req, res, next) => {
    const validSchema = (0, pick_1.pick)(schema, ["params", "query", "body"]);
    const object = (0, pick_1.pick)(req, Object.keys(validSchema));
    const { value, error } = joi_1.default.compile(validSchema)
        .prefs({ errors: { label: "key" }, abortEarly: false })
        .validate(object);
    if (error) {
        // const errorMessage = error.details
        //   .map((details) => details.message)
        //   .join(", ");
        const errors = error.details.map((detail) => {
            var _a;
            return ({
                message: detail.message,
                type: (_a = detail.context) === null || _a === void 0 ? void 0 : _a.key,
            });
        });
        return next(new ApiError_1.ApiError(http_status_1.default.BAD_REQUEST, "Invalid inputs", errors));
    }
    Object.assign(req, value);
    return next();
};
exports.validate = validate;
