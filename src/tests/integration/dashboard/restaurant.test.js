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
const faker_1 = require("@faker-js/faker");
const supertest_1 = __importDefault(require("supertest"));
const express_config_1 = require("../../../api/config/express_config");
const http_status_1 = __importDefault(require("http-status"));
const restaurant_fixture_1 = require("../../fixtures/restaurant.fixture");
const auth_fixture_1 = require("../../fixtures/auth.fixture");
const token_fixture_1 = require("../../fixtures/token.fixture");
(0, setupDB_1.setupDB)();
(0, globals_1.describe)("Restaurant routes", () => {
    (0, globals_1.describe)("POST /v1/restaurant", () => {
        let newRestaurant;
        (0, globals_1.beforeEach)(() => {
            newRestaurant = {
                name: faker_1.faker.person.firstName().toLocaleLowerCase(),
                description: faker_1.faker.lorem.paragraph(),
            };
        });
        (0, globals_1.test)("should return 201 and successfully create restaurant if data is ok", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser]);
            let res = yield (0, supertest_1.default)(express_config_1.app)
                .post("/v1/restaurant")
                .set("Authorization", token_fixture_1.tempUserAccessToken)
                .send(newRestaurant)
                .expect(http_status_1.default.CREATED);
            (0, globals_1.expect)(res.body).toEqual({
                name: newRestaurant.name,
                description: newRestaurant.description,
                id: globals_1.expect.anything(),
                userId: auth_fixture_1.tempUser._id.toString(),
            });
        }));
        (0, globals_1.test)("should return 400 error if the name is duplicated for same user", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertRestaurants)([restaurant_fixture_1.tempRestaurant]);
            yield (0, supertest_1.default)(express_config_1.app)
                .post("/v1/restaurant")
                .set("Authorization", token_fixture_1.tempUserAccessToken)
                .send(Object.assign(Object.assign({}, newRestaurant), { name: restaurant_fixture_1.tempRestaurant.name }))
                .expect(http_status_1.default.BAD_REQUEST);
        }));
    });
    (0, globals_1.describe)("GET /v1/restaurant", () => {
        (0, globals_1.test)("should return 200 and the restaurants array if access token is correct", () => __awaiter(void 0, void 0, void 0, function* () {
            (0, restaurant_fixture_1.insertRestaurants)([restaurant_fixture_1.tempRestaurant]);
            yield (0, supertest_1.default)(express_config_1.app)
                .get(`/v1/restaurant`)
                .set({
                Authorization: token_fixture_1.tempUserAccessToken,
            })
                .send()
                .expect(http_status_1.default.OK);
        }));
        (0, globals_1.test)("should return 401 error if access token is missing", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertRestaurants)([restaurant_fixture_1.tempRestaurant]);
            yield (0, supertest_1.default)(express_config_1.app)
                .get(`/v1/restaurant`)
                .send()
                .expect(http_status_1.default.UNAUTHORIZED);
        }));
    });
    (0, globals_1.describe)("GET /v1/restaurant/:restaurantId", () => {
        (0, globals_1.test)("should return 200 and the restaurant object if data is ok", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertRestaurants)([restaurant_fixture_1.tempRestaurant]);
            const res = yield (0, supertest_1.default)(express_config_1.app)
                .get(`/v1/restaurant/${restaurant_fixture_1.tempRestaurant._id}`)
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .send()
                .expect(http_status_1.default.OK);
            (0, globals_1.expect)(res.body).toEqual({
                name: restaurant_fixture_1.tempRestaurant.name,
                userId: restaurant_fixture_1.tempRestaurant.userId.toString(),
                id: restaurant_fixture_1.tempRestaurant._id.toString(),
            });
        }));
        (0, globals_1.test)("should return 404 error if user trying to get another user restaurant", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser2]);
            yield (0, restaurant_fixture_1.insertRestaurants)([restaurant_fixture_1.tempRestaurant]);
            yield (0, supertest_1.default)(express_config_1.app)
                .get(`/v1/restaurant/${restaurant_fixture_1.tempRestaurant._id}`)
                .set({ authorization: token_fixture_1.tempUser2AccessToken })
                .send()
                .expect(http_status_1.default.NOT_FOUND);
        }));
        (0, globals_1.test)("should return 400 error if restaurantId is invalid mongo id", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, restaurant_fixture_1.insertRestaurants)([restaurant_fixture_1.tempRestaurant]);
            yield (0, supertest_1.default)(express_config_1.app)
                .get("/v1/restaurant/invalidId")
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .send()
                .expect(http_status_1.default.BAD_REQUEST);
        }));
        (0, globals_1.test)("should return 404 error if restaurant is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser]);
            yield (0, supertest_1.default)(express_config_1.app)
                .get(`/v1/restaurant/${restaurant_fixture_1.tempRestaurant._id}`)
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .send()
                .expect(http_status_1.default.NOT_FOUND);
        }));
    });
    (0, globals_1.describe)("PATCH /v1/restaurant/:restaurantId", () => {
        (0, globals_1.test)("should return 200 and successfully update restaurant if data is ok", () => __awaiter(void 0, void 0, void 0, function* () {
            (0, restaurant_fixture_1.insertRestaurants)([restaurant_fixture_1.tempRestaurant]);
            const updateBody = {
                name: "testName",
            };
            const res = yield (0, supertest_1.default)(express_config_1.app)
                .patch(`/v1/restaurant/${restaurant_fixture_1.tempRestaurant._id}`)
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .send(updateBody)
                .expect(http_status_1.default.OK);
            (0, globals_1.expect)(res.body).toEqual({
                name: updateBody.name,
                userId: auth_fixture_1.tempUser._id.toString(),
                id: restaurant_fixture_1.tempRestaurant._id.toString(),
            });
        }));
        (0, globals_1.test)("should return 400 error if menus field is passed", () => __awaiter(void 0, void 0, void 0, function* () {
            (0, restaurant_fixture_1.insertRestaurants)([restaurant_fixture_1.tempRestaurant]);
            const updateBody = {
                menus: ["test"],
            };
            yield (0, supertest_1.default)(express_config_1.app)
                .patch(`/v1/restaurant/${restaurant_fixture_1.tempRestaurant._id}`)
                .set({ authorization: token_fixture_1.tempUserAccessToken })
                .send(updateBody)
                .expect(http_status_1.default.BAD_REQUEST);
        }));
    });
});
