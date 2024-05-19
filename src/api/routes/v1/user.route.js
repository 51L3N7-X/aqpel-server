"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
exports.router = express_1.default.Router();
const user_controller_1 = require("../../controllers/dashboard/user.controller");
const auth_1 = require("../../middlewares/auth");
//verify
exports.router.use((0, auth_1.auth)());
// main requests for user
exports.router.get("/", user_controller_1.getUser);
exports.router.patch("/", user_controller_1.modifyUser);
exports.router.delete("/", user_controller_1.deleteUser);
