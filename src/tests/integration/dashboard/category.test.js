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
const faker_1 = require("@faker-js/faker");
const setupDB_1 = require("../../utils/setupDB");
const globals_1 = require("@jest/globals");
const restaurant_fixture_1 = require("../../fixtures/restaurant.fixture");
const supertest_1 = __importDefault(require("supertest"));
const express_config_1 = require("../../../api/config/express_config");
const token_fixture_1 = require("../../fixtures/token.fixture");
const http_status_1 = __importDefault(require("http-status"));
const menu_1 = require("../../../api/models/menu");
const auth_fixture_1 = require("../../fixtures/auth.fixture");
const mongoose_1 = __importDefault(require("mongoose"));
(0, setupDB_1.setupDB)();
(0, globals_1.describe)("Category Routes", () => {
    (0, globals_1.describe)("POST /v1/restaurant/:restaurantId/menu/:menuId/category", () => {
        let newCategory;
        (0, globals_1.beforeAll)(() => {
            newCategory = {
                name: faker_1.faker.person.firstName(),
                description: faker_1.faker.person.firstName(),
            };
        });
        (0, globals_1.test)("should return 201 and successfully create a category if data is ok", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertMenu)([restaurant_fixture_1.tempMenu]);
            const res = yield (0, supertest_1.default)(express_config_1.app)
                .post(`/v1/restaurant/${restaurant_fixture_1.tempRestaurant._id}/menu/${restaurant_fixture_1.tempMenu._id}/category`)
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .send(newCategory)
                .expect(http_status_1.default.CREATED);
            (0, globals_1.expect)(res.body).toEqual(globals_1.expect.objectContaining({
                name: newCategory.name,
                description: newCategory.description,
                id: globals_1.expect.anything(),
            }));
            const menu = yield menu_1.Menu.findById(restaurant_fixture_1.tempMenu._id);
            (0, globals_1.expect)(menu === null || menu === void 0 ? void 0 : menu.categories[0].toString()).toEqual(res.body.id);
        }));
        (0, globals_1.test)("should return 400 error if items field is inserted", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertMenu)([restaurant_fixture_1.tempMenu]);
            yield (0, supertest_1.default)(express_config_1.app)
                .post(`/v1/restaurant/${restaurant_fixture_1.tempRestaurant._id}/menu/${restaurant_fixture_1.tempMenu._id}/category`)
                .set("Authorization", token_fixture_1.tempUserAccessToken)
                .send(Object.assign(Object.assign({}, newCategory), { items: ["test"] }))
                .expect(http_status_1.default.BAD_REQUEST);
        }));
        (0, globals_1.test)("should return 404 error if token is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertMenu)([restaurant_fixture_1.tempMenu]);
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser2]);
            yield (0, supertest_1.default)(express_config_1.app)
                .post(`/v1/restaurant/${restaurant_fixture_1.tempRestaurant._id}/menu/${restaurant_fixture_1.tempMenu._id}/category`)
                .set("Authorization", token_fixture_1.tempUser2AccessToken)
                .send(newCategory)
                .expect(http_status_1.default.NOT_FOUND);
        }));
    });
    (0, globals_1.describe)("GET /v1/restaurant/:restaurantId/menu/:menuId/category", () => {
        (0, globals_1.test)("should return 200 and categories array if data is ok", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertCategories)([restaurant_fixture_1.tempCategory]);
            const res = yield (0, supertest_1.default)(express_config_1.app)
                .get(`/v1/restaurant/${restaurant_fixture_1.tempRestaurant._id}/menu/${restaurant_fixture_1.tempMenu._id}/category`)
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .expect(http_status_1.default.OK);
            (0, globals_1.expect)(res.body).toEqual(globals_1.expect.arrayContaining([
                globals_1.expect.objectContaining({
                    name: restaurant_fixture_1.tempCategory.name,
                    id: restaurant_fixture_1.tempCategory._id.toString(),
                }),
            ]));
        }));
        (0, globals_1.test)("should return 404 if user trying to get other user categories", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertCategories)([restaurant_fixture_1.tempCategory]);
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser2]);
            yield (0, supertest_1.default)(express_config_1.app)
                .get(`/v1/restaurant/${restaurant_fixture_1.tempRestaurant._id}/menu/${restaurant_fixture_1.tempMenu._id}/category`)
                .set({ authorization: token_fixture_1.tempUser2AccessToken })
                .expect(http_status_1.default.NOT_FOUND);
        }));
        // test("should return 400 error if restaurantId is invalid", async () => {
        //   await insertCategories([tempCategory]);
        //   await request(app)
        //     .get(`/v1/restaurant/invalidId/menu/${tempMenu._id}/category`)
        //     .set({ authorization: tempUserAccessToken })
        //     .expect(httpStatus.BAD_REQUEST);
        // });
        (0, globals_1.test)("should return 400 error if menuId is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertCategories)([restaurant_fixture_1.tempCategory]);
            yield (0, supertest_1.default)(express_config_1.app)
                .get(`/v1/restaurant/${restaurant_fixture_1.tempRestaurant._id}/menu/invalidId/category`)
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .expect(http_status_1.default.BAD_REQUEST);
        }));
    });
    (0, globals_1.describe)("GET /v1/restaurant/:restaurantId/menu/:menuId/category/:categoryId", () => {
        (0, globals_1.test)("should return 200 and category object if data is ok ", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertCategories)([restaurant_fixture_1.tempCategory]);
            const res = yield (0, supertest_1.default)(express_config_1.app)
                .get(`/v1/restaurant/${restaurant_fixture_1.tempCategory._id}/menu/${restaurant_fixture_1.tempMenu._id}/category/${restaurant_fixture_1.tempCategory._id}`)
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .expect(http_status_1.default.OK);
            (0, globals_1.expect)(res.body).toEqual(globals_1.expect.objectContaining({
                name: restaurant_fixture_1.tempCategory.name,
                id: restaurant_fixture_1.tempCategory._id.toString(),
            }));
        }));
        (0, globals_1.test)("should return 400 error if restaurantId is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertCategories)([restaurant_fixture_1.tempCategory]);
            yield (0, supertest_1.default)(express_config_1.app)
                .get(`/v1/restaurant/invalidId/menu/${restaurant_fixture_1.tempMenu._id}/category/${restaurant_fixture_1.tempCategory._id}`)
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .expect(http_status_1.default.BAD_REQUEST);
        }));
        (0, globals_1.test)("should return 400 error if menuId is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertCategories)([restaurant_fixture_1.tempCategory]);
            yield (0, supertest_1.default)(express_config_1.app)
                .get(`/v1/restaurant/${restaurant_fixture_1.tempRestaurant._id}/menu/invalidId/category/${restaurant_fixture_1.tempCategory._id}`)
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .expect(http_status_1.default.BAD_REQUEST);
        }));
        (0, globals_1.test)("should return 404 error if access token is other user token", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertCategories)([restaurant_fixture_1.tempCategory]);
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser2]);
            yield (0, supertest_1.default)(express_config_1.app)
                .get(`/v1/restaurant/${restaurant_fixture_1.tempRestaurant._id}/menu/${restaurant_fixture_1.tempMenu._id}/category/${restaurant_fixture_1.tempCategory._id}`)
                .set({ authorization: token_fixture_1.tempUser2AccessToken })
                .expect(http_status_1.default.NOT_FOUND);
        }));
        (0, globals_1.test)("should return 401 error if access token is missing", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertCategories)([restaurant_fixture_1.tempCategory]);
            yield (0, supertest_1.default)(express_config_1.app)
                .get(`/v1/restaurant/${restaurant_fixture_1.tempRestaurant._id}/menu/${restaurant_fixture_1.tempMenu._id}/category/${restaurant_fixture_1.tempCategory._id}`)
                .expect(http_status_1.default.UNAUTHORIZED);
        }));
    });
    (0, globals_1.describe)("PATCH /v1/restaurant/:restaurantId/menu/:menuId/category/:categoryId", () => {
        (0, globals_1.test)("should return 200 and successfully update category if data is ok", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertCategories)([restaurant_fixture_1.tempCategory]);
            const res = yield (0, supertest_1.default)(express_config_1.app)
                .patch(`/v1/restaurant/${restaurant_fixture_1.tempRestaurant._id}/menu/${restaurant_fixture_1.tempMenu._id}/category/${restaurant_fixture_1.tempCategory._id}`)
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .send({ name: "testName" })
                .expect(http_status_1.default.OK);
            (0, globals_1.expect)(res.body).toEqual(globals_1.expect.objectContaining({
                name: "testName",
                id: restaurant_fixture_1.tempCategory._id.toString(),
            }));
        }));
        // test("should return 404 error if restaurant is not found", async () => {
        //   await insertCategories([tempCategory]);
        //   await request(app)
        //     .patch(
        //       `/v1/restaurant/${tempMenu._id}/menu/${tempMenu._id}/category/${tempCategory._id}`
        //     )
        //     .set({ authorization: tempUserAccessToken })
        //     .send({ name: "testName" })
        //     .expect(httpStatus.NOT_FOUND);
        // });
        (0, globals_1.test)("should return 404 error if category is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertCategories)([restaurant_fixture_1.tempCategory]);
            yield (0, supertest_1.default)(express_config_1.app)
                .patch(`/v1/restaurant/${restaurant_fixture_1.tempRestaurant._id}/menu/${restaurant_fixture_1.tempMenu._id}/category/${new mongoose_1.default.Types.ObjectId()}`)
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .send({ name: "testName" })
                .expect(http_status_1.default.NOT_FOUND);
        }));
        // test("should return 404 error if menu is not found", async () => {
        //   await insertCategories([tempCategory]);
        //   await request(app)
        //     .patch(
        //       `/v1/restaurant/${
        //         tempRestaurant._id
        //       }/menu/${new mongoose.Types.ObjectId()}/category/${tempCategory._id}`
        //     )
        //     .set({ authorization: tempUserAccessToken })
        //     .send({ name: "testName" })
        //     .expect(httpStatus.NOT_FOUND);
        // });
        (0, globals_1.test)("should return 400 error if items field is inserted", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertMenu)([restaurant_fixture_1.tempMenu]);
            yield (0, supertest_1.default)(express_config_1.app)
                .patch(`/v1/restaurant/${restaurant_fixture_1.tempRestaurant._id}/menu/${restaurant_fixture_1.tempMenu._id}/category/${restaurant_fixture_1.tempCategory._id}`)
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .send({ items: ["test"] })
                .expect(http_status_1.default.BAD_REQUEST);
        }));
    });
});
