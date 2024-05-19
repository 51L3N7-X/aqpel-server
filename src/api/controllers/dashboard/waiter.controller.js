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
exports.deleteWaiter = exports.modifyWaiter = exports.getIndivWaiter = exports.getWaiters = exports.addWaiter = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const waiter_service_1 = require("../../services/waiter.service");
const http_status_1 = __importDefault(require("http-status"));
exports.addWaiter = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const waiter = yield (0, waiter_service_1.createWaiter)(Object.assign({ userId: req.user.id }, req.body));
    res.status(http_status_1.default.CREATED).send(waiter);
}));
exports.getWaiters = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const waiters = yield (0, waiter_service_1.getUserWaiters)(req.user.id);
    res.send(waiters);
}));
exports.getIndivWaiter = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const waiter = yield (0, waiter_service_1.getWaiterById)(req.params.waiterId, req.user.id);
    res.send(waiter);
}));
exports.modifyWaiter = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const waiter = yield (0, waiter_service_1.updateWaiterById)(req.params.waiterId, req.user.id, req.body);
    res.send(waiter);
}));
exports.deleteWaiter = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, waiter_service_1.deleteWaiterById)(req.params.waiterId, req.user.id);
    res.status(http_status_1.default.NO_CONTENT).send();
}));
