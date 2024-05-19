"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
exports.router = express_1.default.Router();
const waiter_controller_1 = require("../../controllers/dashboard/waiter.controller");
const auth_1 = require("../../middlewares/auth");
const validate_1 = require("../../middlewares/validate");
const public_1 = require("../../validations/public");
exports.router.use((0, auth_1.auth)());
exports.router.post("/", (0, validate_1.validate)(public_1.waiterCreateValidate), waiter_controller_1.addWaiter);
exports.router.get("/", waiter_controller_1.getWaiters);
exports.router.get("/:waiterId", (0, validate_1.validate)(public_1.waiterGetOrDeleteValidate), waiter_controller_1.getIndivWaiter);
exports.router.patch("/:waiterId", (0, validate_1.validate)(public_1.waiterModifyValidate), waiter_controller_1.modifyWaiter);
exports.router.delete("/:waiterId", (0, validate_1.validate)(public_1.waiterGetOrDeleteValidate), waiter_controller_1.deleteWaiter);
