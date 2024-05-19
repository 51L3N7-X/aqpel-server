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
exports.deleteTable = exports.modifyTable = exports.getIndivTable = exports.getTables = exports.addTable = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const table_service_1 = require("../../services/table.service");
const http_status_1 = __importDefault(require("http-status"));
const floor_1 = require("../../models/floor");
exports.addTable = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const table = yield (0, table_service_1.createTable)(Object.assign({ userId: req.user.id, floorId: req.params.floorId }, req.body));
    const floor = yield floor_1.Floor.findOne({
        _id: req.params.floorId,
        userId: req.user.id,
    });
    floor === null || floor === void 0 ? void 0 : floor.tables.push(table.id);
    yield (floor === null || floor === void 0 ? void 0 : floor.save());
    return res.status(http_status_1.default.CREATED).send(table);
}));
exports.getTables = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tables = yield (0, table_service_1.getUserTablesByFloor)(req.user.id, req.params.floorId);
    return res.send(tables);
}));
exports.getIndivTable = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const table = yield (0, table_service_1.getTableById)(req.params.tableId, req.user.id);
    return res.send(table);
}));
exports.modifyTable = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const table = yield (0, table_service_1.updateTableById)(req.params.tableId, req.user.id, req.body);
    return res.send(table);
}));
exports.deleteTable = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, table_service_1.deleteTableById)(req.params.tableId, req.user.id);
    const floor = yield floor_1.Floor.findOne({
        _id: req.params.floorId,
        userId: req.user.id,
    });
    const index = floor === null || floor === void 0 ? void 0 : floor.tables.indexOf(req.params.tableId);
    if (index)
        floor === null || floor === void 0 ? void 0 : floor.tables.splice(index, 1);
    yield (floor === null || floor === void 0 ? void 0 : floor.save());
    res.status(http_status_1.default.NO_CONTENT).send();
}));
