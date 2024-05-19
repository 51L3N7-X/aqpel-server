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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrders = void 0;
const order_1 = require("../../models/order");
const waiter_1 = require("../../models/waiter");
const catchAsync_1 = require("../../utils/catchAsync");
const ApiError_1 = require("../../utils/ApiError");
exports.getOrders = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const waiter = yield waiter_1.Waiter.findOne({ _id: req.user.id });
    if (!waiter)
        throw new ApiError_1.ApiError(404, "waiter not found");
    const orders = yield order_1.Order.find({
        table_id: { $in: waiter.tables },
        done: false,
    }).sort({ createdAt: 1 });
    return res.status(200).json(orders || []);
}));
