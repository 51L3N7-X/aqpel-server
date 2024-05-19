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
exports.getMenu = exports.getTableOnly = void 0;
const table_1 = require("../../models/table");
const restaurant_1 = require("../../models/restaurant");
const catchAsync_1 = require("../../utils/catchAsync");
exports.getTableOnly = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const table = yield table_1.Table.findOne({ _id: req.params.tableId });
    return res.status(200).send({ table });
}));
exports.getMenu = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurant = yield restaurant_1.Restaurant.findOne({
        _id: req.params.restaurantId,
    })
        .populate({
        path: "menu",
        select: "-userId",
        populate: {
            path: "categories",
            select: "-userId",
            populate: {
                path: "items",
                select: "-userId",
            },
        },
    })
        .select("-userId");
    return res.status(200).send({ restaurant });
}));
