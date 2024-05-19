"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
exports.router = express_1.default.Router();
const kitchen_controller_1 = require("../../controllers/dashboard/kitchen.controller");
const auth_1 = require("../../middlewares/auth");
exports.router.use((0, auth_1.auth)());
exports.router.post("/", kitchen_controller_1.addKitchen);
exports.router.get("/", kitchen_controller_1.getTheKitchen);
exports.router.patch("/", kitchen_controller_1.modifyKitchen);
exports.router.delete("/", kitchen_controller_1.deleteKitchen);
