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
exports.postOrder = void 0;
const order_1 = require("../../models/order");
const restaurant_1 = require("../../models/restaurant");
const table_1 = require("../../models/table");
const ApiError_1 = require("../../utils/ApiError");
const postOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurant = yield restaurant_1.Restaurant.findOne({
        _id: req.body.restaurant_id,
    });
    if (!restaurant)
        throw new ApiError_1.ApiError(404, "Restaurant not found");
    const table = yield table_1.Table.findOne({ _id: req.body.table_id });
    if (!table || Number(table.number) !== Number(req.body.table_number))
        throw new ApiError_1.ApiError(404, "Table not found");
    const order = yield new order_1.Order(req.body);
    yield order.save();
    return res.status(200).send({ message: "success" });
});
exports.postOrder = postOrder;
