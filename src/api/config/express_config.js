"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const morgan_1 = require("./morgan");
const morgan_2 = require("./morgan");
const config_1 = require("./config");
const index_1 = require("../routes/v1/index");
const passport_1 = __importDefault(require("passport"));
const passport_config_1 = require("./passport_config");
const body_parser_1 = __importDefault(require("body-parser"));
const error_1 = require("../middlewares/error");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = require("../utils/ApiError");
exports.app = (0, express_1.default)();
if (config_1.config.env !== "test") {
    exports.app.use(morgan_1.successHandler);
    exports.app.use(morgan_2.errorHandler);
}
exports.app.use((0, cors_1.default)({ origin: "*" }));
exports.app.use(body_parser_1.default.json());
exports.app.use(body_parser_1.default.urlencoded({ extended: true }));
exports.app.use((0, multer_1.default)().none());
exports.app.use(passport_1.default.initialize());
passport_1.default.use("jwt", passport_config_1.jwtStrategy);
exports.app.use("/v1", index_1.router);
exports.app.use((req, res, next) => {
    next(new ApiError_1.ApiError(http_status_1.default.NOT_FOUND, "Not found"));
});
exports.app.use(error_1.errorConverter);
exports.app.use(error_1.errorHandler);
