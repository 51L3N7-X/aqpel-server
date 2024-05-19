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
exports.getUrl = void 0;
const getS3Url_1 = require("../../services/getS3Url");
const catchAsync_1 = require("../../utils/catchAsync");
const ApiError_1 = require("../../utils/ApiError");
const http_status_1 = __importDefault(require("http-status"));
exports.getUrl = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fileExtension = req.query.fileExtension;
    // if (!fileExtension) throw new ApiError(400, "Please insert file extension");
    const allowExtensions = ["png", "jpg", "jepg"];
    if (!fileExtension || !allowExtensions.includes(fileExtension))
        throw new ApiError_1.ApiError(http_status_1.default.BAD_REQUEST, "Only images are allowed");
    const s3Data = yield (0, getS3Url_1.getS3Url)(fileExtension, req.user.id);
    res.send(s3Data);
}));
