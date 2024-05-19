"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
exports.router = express_1.default.Router();
// import { login } from "../../controllers/app/login.controller";
const getOrders_controller_1 = require("../../controllers/app/getOrders.controller");
const getTables_controller_1 = require("../../controllers/app/getTables.controller");
const auth_1 = require("../../middlewares/auth");
// router.post("/login", login);
exports.router.use((0, auth_1.auth)());
exports.router.get("/getOrders", getOrders_controller_1.getOrders);
exports.router.get("/getTables", getTables_controller_1.getTables);
