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
const auth_fixture_1 = require("../../fixtures/auth.fixture");
const mongoose_1 = __importDefault(require("mongoose"));
const category_1 = require("../../../api/models/category");
(0, setupDB_1.setupDB)();
(0, globals_1.describe)("Items Routes", () => {
    (0, globals_1.describe)("POST /v1/restaurant/:restaurantId/menu/:menuId/category/:categoryId/item", () => {
        let newItem;
        (0, globals_1.beforeAll)(() => {
            newItem = {
                name: faker_1.faker.person.firstName(),
                description: faker_1.faker.person.firstName(),
                price: faker_1.faker.finance.amount(),
            };
        });
        (0, globals_1.test)("should return 201 and successfully create an item if data is ok", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertCategories)([restaurant_fixture_1.tempCategory]);
            const res = yield (0, supertest_1.default)(express_config_1.app)
                .post(`/v1/restaurant/${restaurant_fixture_1.tempRestaurant._id}/menu/${restaurant_fixture_1.tempMenu._id}/category/${restaurant_fixture_1.tempCategory._id}/item`)
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .send(newItem)
                .expect(http_status_1.default.CREATED);
            (0, globals_1.expect)(res.body).toEqual(globals_1.expect.objectContaining({
                name: newItem.name,
                description: newItem.description,
                id: globals_1.expect.anything(),
            }));
            const category = yield category_1.Category.findById(restaurant_fixture_1.tempCategory._id);
            (0, globals_1.expect)(category === null || category === void 0 ? void 0 : category.items[0].toString()).toEqual(res.body.id);
        }));
        (0, globals_1.test)("should return 404 error if token is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertMenu)([restaurant_fixture_1.tempMenu]);
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser2]);
            yield (0, supertest_1.default)(express_config_1.app)
                .post(`/v1/restaurant/${restaurant_fixture_1.tempRestaurant._id}/menu/${restaurant_fixture_1.tempMenu._id}/category/${restaurant_fixture_1.tempCategory._id}/item`)
                .set("Authorization", token_fixture_1.tempUser2AccessToken)
                .send(newItem)
                .expect(http_status_1.default.NOT_FOUND);
        }));
    });
    (0, globals_1.describe)("GET /v1/restaurant/:restaurantId/menu/:menuId/category/:categoryId/item", () => {
        (0, globals_1.test)("should return 200 and items array if data is ok", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertItems)([restaurant_fixture_1.tempItem]);
            const res = yield (0, supertest_1.default)(express_config_1.app)
                .get(`/v1/restaurant/${restaurant_fixture_1.tempRestaurant._id}/menu/${restaurant_fixture_1.tempMenu._id}/category/${restaurant_fixture_1.tempCategory._id}/item`)
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .expect(http_status_1.default.OK);
            (0, globals_1.expect)(res.body).toEqual(globals_1.expect.arrayContaining([
                globals_1.expect.objectContaining({
                    name: restaurant_fixture_1.tempItem.name,
                    id: restaurant_fixture_1.tempItem._id.toString(),
                }),
            ]));
        }));
        (0, globals_1.test)("should return 404 if user trying to get other user items", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertItems)([restaurant_fixture_1.tempItem]);
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser2]);
            yield (0, supertest_1.default)(express_config_1.app)
                .get(`/v1/restaurant/${restaurant_fixture_1.tempRestaurant._id}/menu/${restaurant_fixture_1.tempMenu._id}/category/${restaurant_fixture_1.tempItem._id}/item`)
                .set({ authorization: token_fixture_1.tempUser2AccessToken })
                .expect(http_status_1.default.NOT_FOUND);
        }));
        (0, globals_1.test)("should return 400 error if categoryId is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertItems)([restaurant_fixture_1.tempItem]);
            yield (0, supertest_1.default)(express_config_1.app)
                .get(`/v1/restaurant/${restaurant_fixture_1.tempRestaurant._id}/menu/${restaurant_fixture_1.tempMenu._id}/category/invalidId/item`)
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .expect(http_status_1.default.BAD_REQUEST);
        }));
    });
    (0, globals_1.describe)("GET /v1/restaurant/:restaurantId/menu/:menuId/category/:categoryId/item/:itemId", () => {
        (0, globals_1.test)("should return 200 and item object if data is ok ", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertItems)([restaurant_fixture_1.tempItem]);
            const res = yield (0, supertest_1.default)(express_config_1.app)
                .get(`/v1/restaurant/${restaurant_fixture_1.tempCategory._id}/menu/${restaurant_fixture_1.tempMenu._id}/category/${restaurant_fixture_1.tempCategory._id}/item/${restaurant_fixture_1.tempItem._id}`)
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .expect(http_status_1.default.OK);
            (0, globals_1.expect)(res.body).toEqual(globals_1.expect.objectContaining({
                name: restaurant_fixture_1.tempItem.name,
                id: restaurant_fixture_1.tempItem._id.toString(),
            }));
        }));
        (0, globals_1.test)("should return 400 error if restaurantId is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertItems)([restaurant_fixture_1.tempItem]);
            yield (0, supertest_1.default)(express_config_1.app)
                .get(`/v1/restaurant/invalidId/menu/${restaurant_fixture_1.tempMenu._id}/category/${restaurant_fixture_1.tempCategory._id}/item/${restaurant_fixture_1.tempItem._id}`)
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .expect(http_status_1.default.BAD_REQUEST);
        }));
        (0, globals_1.test)("should return 400 error if menuId is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertItems)([restaurant_fixture_1.tempItem]);
            yield (0, supertest_1.default)(express_config_1.app)
                .get(`/v1/restaurant/${restaurant_fixture_1.tempRestaurant._id}/menu/invalidId/category/${restaurant_fixture_1.tempCategory._id}/item/${restaurant_fixture_1.tempItem._id}`)
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .expect(http_status_1.default.BAD_REQUEST);
        }));
        (0, globals_1.test)("should return 400 error if categoryId is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertItems)([restaurant_fixture_1.tempItem]);
            yield (0, supertest_1.default)(express_config_1.app)
                .get(`/v1/restaurant/${restaurant_fixture_1.tempRestaurant._id}/menu/${restaurant_fixture_1.tempMenu._id}/category/invalidId/item/${restaurant_fixture_1.tempItem._id}`)
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .expect(http_status_1.default.BAD_REQUEST);
        }));
        (0, globals_1.test)("should return 404 error if access token is other user token", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertItems)([restaurant_fixture_1.tempItem]);
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser2]);
            yield (0, supertest_1.default)(express_config_1.app)
                .get(`/v1/restaurant/${restaurant_fixture_1.tempRestaurant._id}/menu/${restaurant_fixture_1.tempMenu._id}/category/${restaurant_fixture_1.tempCategory._id}/item/${restaurant_fixture_1.tempItem._id}`)
                .set({ authorization: token_fixture_1.tempUser2AccessToken })
                .expect(http_status_1.default.NOT_FOUND);
        }));
        (0, globals_1.test)("should return 401 error if access token is missing", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertItems)([restaurant_fixture_1.tempItem]);
            yield (0, supertest_1.default)(express_config_1.app)
                .get(`/v1/restaurant/${restaurant_fixture_1.tempRestaurant._id}/menu/${restaurant_fixture_1.tempMenu._id}/category/${restaurant_fixture_1.tempCategory._id}/item/${restaurant_fixture_1.tempItem._id}`)
                .expect(http_status_1.default.UNAUTHORIZED);
        }));
    });
    (0, globals_1.describe)("PATCH /v1/restaurant/:restaurantId/menu/:menuId/category/:categoryId/item/:itemId", () => {
        (0, globals_1.test)("should return 200 and successfully update the item if data is ok", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertItems)([restaurant_fixture_1.tempItem]);
            const res = yield (0, supertest_1.default)(express_config_1.app)
                .patch(`/v1/restaurant/${restaurant_fixture_1.tempRestaurant._id}/menu/${restaurant_fixture_1.tempMenu._id}/category/${restaurant_fixture_1.tempCategory._id}/item/${restaurant_fixture_1.tempItem._id}`)
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .send({ name: "testName" })
                .expect(http_status_1.default.OK);
            (0, globals_1.expect)(res.body).toEqual(globals_1.expect.objectContaining({
                name: "testName",
                id: restaurant_fixture_1.tempItem._id.toString(),
            }));
        }));
        (0, globals_1.test)("should return 404 error if item is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertCategories)([restaurant_fixture_1.tempCategory]);
            yield (0, supertest_1.default)(express_config_1.app)
                .patch(`/v1/restaurant/${restaurant_fixture_1.tempRestaurant._id}/menu/${restaurant_fixture_1.tempMenu._id}/category/${restaurant_fixture_1.tempCategory._id}/item/${new mongoose_1.default.Types.ObjectId()}`)
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .send({ name: "testName" })
                .expect(http_status_1.default.NOT_FOUND);
        }));
    });
});
