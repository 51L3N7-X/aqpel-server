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
exports.deleteFloor = exports.modifyFloor = exports.getFloors = exports.getIndivFloor = exports.createFloor = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const http_status_1 = __importDefault(require("http-status"));
const floor_service_1 = require("../../services/floor.service");
exports.createFloor = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const floor = yield (0, floor_service_1.createFloor)(Object.assign({ userId: req.user.id }, req.body));
    res.status(http_status_1.default.CREATED).send(floor);
}));
exports.getIndivFloor = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const floor = yield (0, floor_service_1.getFloorById)(req.params.floorId, req.user.id);
    res.send(floor);
}));
exports.getFloors = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let floors = yield (0, floor_service_1.getUserFloors)(req.user.id);
    if (req.query.tables !== undefined) {
        const populatedFloors = (yield (0, floor_service_1.getFloorsWithTables)(req.user.id)).map((floor) => (Object.assign(Object.assign({}, floor.toJSON()), { tables: floor.tables })));
        return res.send(populatedFloors);
    }
    res.send(floors);
}));
exports.modifyFloor = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const floor = yield (0, floor_service_1.updateFloorById)(req.params.floorId, req.user.id, req.body);
    res.send(floor);
}));
exports.deleteFloor = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, floor_service_1.deleteFloorById)(req.params.floorId, req.user.id);
    res.status(http_status_1.default.NO_CONTENT).send();
}));
