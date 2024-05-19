"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const validate_1 = require("../../middlewares/validate");
const public_1 = require("../../validations/public");
const floor_controller_1 = require("../../controllers/dashboard/floor.controller");
const auth_1 = require("../../middlewares/auth");
const table_controller_1 = require("../../controllers/dashboard/table.controller");
const router = express_1.default.Router();
exports.router = router;
router.use((0, auth_1.auth)());
router
    .route("/")
    .post((0, validate_1.validate)(public_1.floorCreateValidate), floor_controller_1.createFloor)
    .get(floor_controller_1.getFloors);
router
    .route("/:floorId")
    .get((0, validate_1.validate)(public_1.floorGetValidate), floor_controller_1.getIndivFloor)
    .patch((0, validate_1.validate)(public_1.floorModifyValidate), floor_controller_1.modifyFloor)
    .delete((0, validate_1.validate)(public_1.floorDeleteValidate), floor_controller_1.deleteFloor);
// Table routes under a floor
router
    .route("/:floorId/table")
    .post((0, validate_1.validate)(public_1.tableCreateValidate), table_controller_1.addTable)
    .get(table_controller_1.getTables);
router
    .route("/:floorId/table/:tableId")
    .get((0, validate_1.validate)(public_1.tableGetValidate), table_controller_1.getIndivTable)
    .patch((0, validate_1.validate)(public_1.tableModifyValidate), table_controller_1.modifyTable)
    .delete((0, validate_1.validate)(public_1.tableDeleteValidate), table_controller_1.deleteTable);
