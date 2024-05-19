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
exports.sendCode = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const smscode = require("../../models/smsCode");
exports.sendCode = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone } = req.body;
    const code = Math.floor(1000 + Math.random() * 9000);
    let user = yield smscode.findOne({ phone });
    if (user) {
        yield user.set({ phone, code }).save();
    }
    else {
        yield smscode.create({ phone, code });
    }
    // TODO: send code here
    return res.status(200).json({ success: "true", code });
}));
