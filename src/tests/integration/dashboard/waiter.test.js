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
const faker_1 = require("@faker-js/faker");
const restaurant_fixture_1 = require("../../fixtures/restaurant.fixture");
const waiter_fixture_1 = require("../../fixtures/waiter.fixture");
const mongoose_1 = __importDefault(require("mongoose"));
(0, setupDB_1.setupDB)();
(0, globals_1.describe)("Waiter Routes", () => {
    (0, globals_1.describe)("POST /v1/waiter/", () => {
        let newWaiter = {
            username: "testusername",
            password: "password123$",
            restaurantId: restaurant_fixture_1.tempRestaurant._id.toString(),
        };
        (0, globals_1.beforeEach)(() => {
            newWaiter = Object.assign(Object.assign({}, newWaiter), { username: faker_1.faker.person.firstName().toLowerCase() });
        });
        (0, globals_1.test)("it should return 201 and successfully create a waiter if the data is ok", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertRestaurants)([restaurant_fixture_1.tempRestaurant]);
            const res = yield (0, supertest_1.default)(express_config_1.app)
                .post(`/v1/waiter`)
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .send(newWaiter)
                .expect(http_status_1.default.CREATED);
            (0, globals_1.expect)(res.body).toMatchObject(globals_1.expect.objectContaining({
                username: newWaiter.username,
                password: newWaiter.password,
                id: globals_1.expect.anything(),
                restaurantId: newWaiter.restaurantId,
            }));
        }));
        (0, globals_1.test)("it should return 400 error if username is already exist", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertRestaurants)([restaurant_fixture_1.tempRestaurant]);
            yield (0, waiter_fixture_1.insertWaiter)([waiter_fixture_1.tempWaiter]);
            newWaiter.username = waiter_fixture_1.tempWaiter.username;
            const res = yield (0, supertest_1.default)(express_config_1.app)
                .post("/v1/waiter")
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .send(newWaiter)
                .expect(http_status_1.default.BAD_REQUEST);
        }));
        (0, globals_1.test)("it should return 400 error if restaurant not found", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser]);
            const res = yield (0, supertest_1.default)(express_config_1.app)
                .post("/v1/waiter")
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .send(newWaiter)
                .expect(http_status_1.default.BAD_REQUEST);
        }));
        (0, globals_1.test)("should return 400 error if password is less than 8 characters", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertRestaurants)([restaurant_fixture_1.tempRestaurant]);
            newWaiter.password = "pass1";
            const res = yield (0, supertest_1.default)(express_config_1.app)
                .post("/v1/waiter")
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .send(newWaiter)
                .expect(http_status_1.default.BAD_REQUEST);
            (0, globals_1.expect)(res.body.errors).toEqual(globals_1.expect.arrayContaining([
                globals_1.expect.objectContaining({
                    type: "password",
                    message: globals_1.expect.anything(),
                }),
            ]));
        }));
        (0, globals_1.test)("should return 400 error if password dose not contain both letters and numbers", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertRestaurants)([restaurant_fixture_1.tempRestaurant]);
            newWaiter.password = "1111111";
            const res = yield (0, supertest_1.default)(express_config_1.app)
                .post("/v1/waiter")
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .send(newWaiter)
                .expect(http_status_1.default.BAD_REQUEST);
            (0, globals_1.expect)(res.body.errors).toEqual(globals_1.expect.arrayContaining([
                globals_1.expect.objectContaining({
                    type: "password",
                    message: globals_1.expect.anything(),
                }),
            ]));
        }));
        (0, globals_1.test)("should return 400 error if username is less than 3 characters", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertRestaurants)([restaurant_fixture_1.tempRestaurant]);
            newWaiter.username = "js";
            const res = yield (0, supertest_1.default)(express_config_1.app)
                .post("/v1/waiter")
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .send(newWaiter)
                .expect(http_status_1.default.BAD_REQUEST);
            (0, globals_1.expect)(res.body.errors).toEqual(globals_1.expect.arrayContaining([
                globals_1.expect.objectContaining({
                    type: "username",
                    message: globals_1.expect.anything(),
                }),
            ]));
        }));
        (0, globals_1.test)("should return 400 error if one item of array items is invalid mongo id", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertRestaurants)([restaurant_fixture_1.tempRestaurant]);
            //@ts-ignore
            newWaiter.tables = ["123"];
            const res = yield (0, supertest_1.default)(express_config_1.app)
                .post("/v1/waiter")
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .send(newWaiter)
                .expect(http_status_1.default.BAD_REQUEST);
            (0, globals_1.expect)(res.body.errors).toEqual(globals_1.expect.arrayContaining([
                globals_1.expect.objectContaining({
                    type: 0,
                    message: globals_1.expect.anything(),
                }),
            ]));
        }));
    });
    (0, globals_1.describe)("GET /v1/waiter/", () => {
        (0, globals_1.test)("should return 200 and waiters array if access token is correct", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser]);
            yield (0, waiter_fixture_1.insertWaiter)([waiter_fixture_1.tempWaiter]);
            const res = yield (0, supertest_1.default)(express_config_1.app)
                .get(`/v1/waiter`)
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .send()
                .expect(http_status_1.default.OK);
        }));
        (0, globals_1.test)("should return 401 error if access token is missed", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, waiter_fixture_1.insertWaiter)([waiter_fixture_1.tempWaiter]);
            yield (0, supertest_1.default)(express_config_1.app)
                .get(`/v1/waiter`)
                .send()
                .expect(http_status_1.default.UNAUTHORIZED);
        }));
    });
    (0, globals_1.describe)("GET /v1/waiter/:waiterId", () => {
        (0, globals_1.test)("it should return 200 and waiter object if data is ok", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser]);
            yield (0, waiter_fixture_1.insertWaiter)([waiter_fixture_1.tempWaiter]);
            yield (0, supertest_1.default)(express_config_1.app)
                .get(`/v1/waiter/${waiter_fixture_1.tempWaiter._id}`)
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .send()
                .expect(http_status_1.default.OK);
        }));
        (0, globals_1.test)("it should return 401 error if user trying to get other user waiter", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser, auth_fixture_1.tempUser2]);
            yield (0, waiter_fixture_1.insertWaiter)([waiter_fixture_1.tempWaiter]);
            yield (0, supertest_1.default)(express_config_1.app)
                .get(`/v1/waiter/${waiter_fixture_1.tempWaiter._id}`)
                .set({ authorization: token_fixture_1.tempUser2AccessToken })
                .send()
                .expect(http_status_1.default.NOT_FOUND);
        }));
        (0, globals_1.test)("it should return 401 error if waiterId is invalid mongo id", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser]);
            yield (0, waiter_fixture_1.insertWaiter)([waiter_fixture_1.tempWaiter]);
            yield (0, supertest_1.default)(express_config_1.app)
                .get(`/v1/waiter/invalidId`)
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .send()
                .expect(http_status_1.default.BAD_REQUEST);
        }));
        (0, globals_1.test)("it should return 404 error if table is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser]);
            yield (0, waiter_fixture_1.insertWaiter)([waiter_fixture_1.tempWaiter]);
            yield (0, supertest_1.default)(express_config_1.app)
                .get(`/v1/waiter/${new mongoose_1.default.Types.ObjectId()}`)
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .send()
                .expect(http_status_1.default.NOT_FOUND);
        }));
    });
    (0, globals_1.describe)("PATCH /v1/waiter/:waiterId", () => {
        (0, globals_1.test)("should return 200 and successfully update the floor if data is ok", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertRestaurants)([restaurant_fixture_1.tempRestaurant]);
            yield (0, waiter_fixture_1.insertWaiter)([waiter_fixture_1.tempWaiter]);
            const updateBody = {
                username: "testusername123$xx",
                restaurantId: restaurant_fixture_1.tempRestaurant._id.toString(),
            };
            const res = yield (0, supertest_1.default)(express_config_1.app)
                .patch(`/v1/waiter/${waiter_fixture_1.tempWaiter._id}`)
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .send(updateBody)
                .expect(http_status_1.default.OK);
            (0, globals_1.expect)(res.body).toMatchObject(globals_1.expect.objectContaining({
                username: updateBody.username,
                userId: auth_fixture_1.tempUser._id.toString(),
                id: waiter_fixture_1.tempWaiter._id.toString(),
            }));
        }));
    });
    // describe("GET /v1/floor/:floorId/table", () => {
    //   test("should return 200 and tables array if the access token is correct", async () => {
    //     await insertTheTable();
    //     await request(app)
    //       .get(`/v1/floor/${tempFloor._id}/table`)
    //       .set({ authorization: tempUserAccessToken })
    //       .send()
    //       .expect(httpStatus.OK);
    //   });
    //   test("should return 401 error if access token is missed", async () => {
    //     await insertTheTable();
    //     await request(app)
    //       .get(`/v1/floor/${tempFloor._id}/table`)
    //       .send()
    //       .expect(httpStatus.UNAUTHORIZED);
    //   });
    // });
    // describe("GET /v1/floor/:floorId/table/:tableId", () => {
    //   test("should return 200 and the table object if data is ok", async () => {
    //     await insertTheTable();
    //     const res = await request(app)
    //       .get(`/v1/floor/${tempFloor._id}/table/${tempTable._id}`)
    //       .set({ authorization: tempUserAccessToken })
    //       .send()
    //       .expect(httpStatus.OK);
    //     expect(res.body).toMatchObject({
    //       number: String(tempTable.number),
    //       id: tempTable._id.toString(),
    //     });
    //   });
    //   test("should return 404 error if user trying to get another user table", async () => {
    //     await insertUsers([tempUser, tempUser2]);
    //     await Table.insertMany([tempTable]);
    //     const res = await request(app)
    //       .get(`/v1/floor/${tempFloor._id}/table/${tempTable._id}`)
    //       .set({ authorization: tempUser2AccessToken })
    //       .send()
    //       .expect(httpStatus.NOT_FOUND);
    //   });
    //   test("should return 400 error if tableId is invalid mongo id", async () => {
    //     await insertTheTable();
    //     await request(app)
    //       .get(`/v1/floor/${tempFloor._id}/table/invalidId`)
    //       .set({ authorization: tempUserAccessToken })
    //       .send()
    //       .expect(httpStatus.BAD_REQUEST);
    //   });
    //   test("should return 404 error if the table is not found", async () => {
    //     await insertTheTable();
    //     await request(app)
    //       .get(
    //         `/v1/floor/${tempFloor._id}/table/${new mongoose.Types.ObjectId()}`
    //       )
    //       .set({ authorization: tempUserAccessToken })
    //       .send()
    //       .expect(httpStatus.NOT_FOUND);
    //   });
    // });
    // describe("PATCH /v1/floor/:floorId/table/:tableId", () => {
    //   test("should return 200 and successfully update the floor if data is ok", async () => {
    //     await insertTheTable();
    //     const updateBody = {
    //       number: 69,
    //     };
    //     const res = await request(app)
    //       .patch(`/v1/floor/${tempFloor._id}/table/${tempTable._id}`)
    //       .set({ authorization: tempUserAccessToken })
    //       .send(updateBody)
    //       .expect(httpStatus.OK);
    //     expect(res.body).toMatchObject(
    //       expect.objectContaining({
    //         number: String(updateBody.number),
    //         userId: tempUser._id.toString(),
    //         floorId: tempFloor._id.toString(),
    //         id: tempTable._id.toString(),
    //       })
    //     );
    //   });
    // });
});
