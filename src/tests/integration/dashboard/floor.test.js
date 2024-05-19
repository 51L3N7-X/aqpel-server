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
const globals_1 = require("@jest/globals");
const setupDB_1 = require("../../utils/setupDB");
const supertest_1 = __importDefault(require("supertest"));
const express_config_1 = require("../../../api/config/express_config");
const http_status_1 = __importDefault(require("http-status"));
const auth_fixture_1 = require("../../fixtures/auth.fixture");
const token_fixture_1 = require("../../fixtures/token.fixture");
const floor_fixture_1 = require("../../fixtures/floor.fixture");
const mongoose_1 = __importDefault(require("mongoose"));
(0, setupDB_1.setupDB)();
(0, globals_1.describe)("Floor Routes", () => {
    (0, globals_1.describe)("POST /v1/floor", () => {
        let newFloor = {
            number: 0,
        };
        (0, globals_1.beforeEach)(() => {
            newFloor = {
                number: Math.floor(Math.random() * 9) + 2,
            };
        });
        (0, globals_1.test)("it should return 201 and successfully create a floor is the data is ok", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser]);
            const res = yield (0, supertest_1.default)(express_config_1.app)
                .post("/v1/floor")
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .send(newFloor)
                .expect(http_status_1.default.CREATED);
            (0, globals_1.expect)(res.body).toMatchObject(globals_1.expect.objectContaining({
                number: String(newFloor.number),
                id: globals_1.expect.anything(),
            }));
        }));
        (0, globals_1.test)("it should return 400 if the floor number is existed already", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser]);
            yield (0, floor_fixture_1.insertTheFloor)();
            newFloor.number = floor_fixture_1.tempFloor.number;
            yield (0, supertest_1.default)(express_config_1.app)
                .post("/v1/floor")
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .send(newFloor)
                .expect(http_status_1.default.BAD_REQUEST);
        }));
        (0, globals_1.test)("it should return 400 if the floor number is larger than 99", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser]);
            yield (0, floor_fixture_1.insertTheFloor)();
            newFloor.number = 100;
            yield (0, supertest_1.default)(express_config_1.app)
                .post("/v1/floor")
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .send(newFloor)
                .expect(http_status_1.default.BAD_REQUEST);
        }));
    });
    (0, globals_1.describe)("GET /v1/floor", () => {
        (0, globals_1.test)("should return 200 and floors array if the access token is correct", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, floor_fixture_1.insertTheFloor)();
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser]);
            yield (0, supertest_1.default)(express_config_1.app)
                .get("/v1/floor")
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .send()
                .expect(http_status_1.default.OK);
        }));
        (0, globals_1.test)("should return 401 error if access token is missed", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, floor_fixture_1.insertTheFloor)();
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser]);
            yield (0, supertest_1.default)(express_config_1.app)
                .get("/v1/floor")
                .send()
                .expect(http_status_1.default.UNAUTHORIZED);
        }));
    });
    (0, globals_1.describe)("GET /v1/floor/:floorId", () => {
        (0, globals_1.test)("should return 200 and the floor object if data is ok", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser]);
            yield (0, floor_fixture_1.insertTheFloor)();
            const res = yield (0, supertest_1.default)(express_config_1.app)
                .get(`/v1/floor/${floor_fixture_1.tempFloor._id}`)
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .send()
                .expect(http_status_1.default.OK);
            (0, globals_1.expect)(res.body).toMatchObject({
                number: String(floor_fixture_1.tempFloor.number),
                id: floor_fixture_1.tempFloor._id.toString(),
            });
        }));
        (0, globals_1.test)("should return 404 error if user trying to get another user floor", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser, auth_fixture_1.tempUser2]);
            yield (0, floor_fixture_1.insertTheFloor)();
            const res = yield (0, supertest_1.default)(express_config_1.app)
                .get(`/v1/floor/${floor_fixture_1.tempFloor._id}`)
                .set({ authorization: token_fixture_1.tempUser2AccessToken })
                .send()
                .expect(http_status_1.default.NOT_FOUND);
        }));
        (0, globals_1.test)("should return 400 error if floorId is invalid mongo id", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, floor_fixture_1.insertTheFloor)();
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser]);
            yield (0, supertest_1.default)(express_config_1.app)
                .get("/v1/floor/invalidId")
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .send()
                .expect(http_status_1.default.BAD_REQUEST);
        }));
        (0, globals_1.test)("should return 404 error if floor is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, floor_fixture_1.insertTheFloor)();
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser]);
            const res = yield (0, supertest_1.default)(express_config_1.app)
                .get(`/v1/floor/${new mongoose_1.default.Types.ObjectId()}`)
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .send()
                .expect(http_status_1.default.NOT_FOUND);
        }));
    });
    (0, globals_1.describe)("PATCH /v1/floor/:floorId", () => {
        (0, globals_1.test)("should return 200 and successfully update the floor if data is ok", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, floor_fixture_1.insertTheFloor)();
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser]);
            const updateBody = {
                number: 69,
            };
            const res = yield (0, supertest_1.default)(express_config_1.app)
                .patch(`/v1/floor/${floor_fixture_1.tempFloor._id}`)
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .send(updateBody)
                .expect(http_status_1.default.OK);
            (0, globals_1.expect)(res.body).toEqual({
                number: String(updateBody.number),
                userId: auth_fixture_1.tempUser._id.toString(),
                id: floor_fixture_1.tempFloor._id.toString(),
            });
        }));
        (0, globals_1.test)("should return 400 error if tables field is passed", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, floor_fixture_1.insertTheFloor)();
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser]);
            const updateBody = {
                tables: ["test"],
            };
            yield (0, supertest_1.default)(express_config_1.app)
                .patch(`/v1/restaurant/${floor_fixture_1.tempFloor._id}`)
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .send(updateBody)
                .expect(http_status_1.default.BAD_REQUEST);
        }));
    });
});
