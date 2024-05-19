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
exports.getTables = void 0;
const kitchen_1 = require("../../models/kitchen");
const table_1 = require("../../models/table");
const catchAsync_1 = require("../../utils/catchAsync");
exports.getTables = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const kitchen = yield kitchen_1.Kitchen.findOne({ _id: req.user.id });
    if (!kitchen)
        throw new Error("kitchen not found.");
    const tables = yield table_1.Table.findOne({
        restaurant_name: kitchen.restaurant_name,
    }).select("-userId");
    return res.status(200).json(tables || []);
}));
