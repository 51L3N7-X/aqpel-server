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
const user_1 = require("../../../api/models/user");
const auth_fixture_1 = require("../../fixtures/auth.fixture");
const moment_1 = __importDefault(require("moment"));
const config_1 = require("../../../api/config/config");
const token_service_1 = require("../../../api/services/token.service");
const tokens_1 = require("../../../api/constants/tokens");
const services_1 = require("../../../api/services");
const token_1 = require("../../../api/models/token");
(0, setupDB_1.setupDB)();
(0, globals_1.describe)("Auth routes", () => {
    (0, globals_1.describe)("POST /v1/auth/register", () => {
        let newUser;
        (0, globals_1.beforeEach)(() => {
            newUser = {
                username: faker_1.faker.person.firstName().toLowerCase(),
                email: faker_1.faker.internet.email().toLowerCase(),
                password: "password1",
            };
        });
        (0, globals_1.test)("should return 201 and successfully register user if request data is ok", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(express_config_1.app)
                .post("/v1/auth/register")
                .send(newUser)
                .expect(http_status_1.default.CREATED);
            (0, globals_1.expect)(res.body).toHaveProperty("user");
            (0, globals_1.expect)(res.body.success).toBe(true);
            (0, globals_1.expect)(res.body.user).not.toHaveProperty("password");
            (0, globals_1.expect)(res.body.user).toEqual({
                username: newUser.username,
                email: newUser.email,
                id: globals_1.expect.anything(),
                plan: "free",
                verified: false,
            });
            const dbUser = yield user_1.User.findById(res.body.user.id);
            (0, globals_1.expect)(dbUser).toBeDefined();
            (0, globals_1.expect)(dbUser === null || dbUser === void 0 ? void 0 : dbUser.password).not.toBe(newUser.password);
            (0, globals_1.expect)(dbUser).toMatchObject({
                username: newUser.username,
                email: newUser.email,
                plan: "free",
                verified: false,
            });
            (0, globals_1.expect)(res.body.tokens).toEqual({
                access: {
                    token: globals_1.expect.anything(),
                    expires: globals_1.expect.anything(),
                },
                refresh: {
                    token: globals_1.expect.anything(),
                    expires: globals_1.expect.anything(),
                },
            });
        }));
        (0, globals_1.test)("should return 400 error if email is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
            newUser.email = "shit";
            yield (0, supertest_1.default)(express_config_1.app)
                .post("/v1/auth/register")
                .send(newUser)
                .expect(http_status_1.default.BAD_REQUEST);
        }));
        (0, globals_1.test)("should return 409 error if email is already used", () => __awaiter(void 0, void 0, void 0, function* () {
            (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser]);
            newUser.email = auth_fixture_1.tempUser.email;
            const res = yield (0, supertest_1.default)(express_config_1.app)
                .post("/v1/auth/register")
                .send(newUser)
                .expect(http_status_1.default.CONFLICT);
            (0, globals_1.expect)(res.body.errors).toEqual(globals_1.expect.arrayContaining([
                globals_1.expect.objectContaining({
                    type: "email",
                    message: globals_1.expect.anything(),
                }),
            ]));
        }));
        (0, globals_1.test)("should return 409 error if username is already used", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser]);
            newUser.username = auth_fixture_1.tempUser.username;
            const res = yield (0, supertest_1.default)(express_config_1.app)
                .post("/v1/auth/register")
                .send(newUser)
                .expect(http_status_1.default.CONFLICT);
            (0, globals_1.expect)(res.body.errors).toEqual(globals_1.expect.arrayContaining([
                globals_1.expect.objectContaining({
                    type: "username",
                    message: globals_1.expect.anything(),
                }),
            ]));
        }));
        (0, globals_1.test)("should return 409 error if both username and email is already used", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser]);
            newUser.username = auth_fixture_1.tempUser.username;
            newUser.email = auth_fixture_1.tempUser.email;
            const res = yield (0, supertest_1.default)(express_config_1.app)
                .post("/v1/auth/register")
                .send(newUser)
                .expect(http_status_1.default.CONFLICT);
            (0, globals_1.expect)(res.body.errors).toEqual(globals_1.expect.arrayContaining([
                globals_1.expect.objectContaining({
                    type: "username",
                    message: globals_1.expect.anything(),
                }),
                globals_1.expect.objectContaining({
                    type: "email",
                    message: globals_1.expect.anything(),
                }),
            ]));
        }));
        (0, globals_1.test)("should return 400 error if password is less than 8 characters", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser]);
            newUser.password = "pass1";
            const res = yield (0, supertest_1.default)(express_config_1.app)
                .post("/v1/auth/register")
                .send(newUser)
                .expect(http_status_1.default.BAD_REQUEST);
            (0, globals_1.expect)(res.body.errors).toEqual(globals_1.expect.arrayContaining([
                globals_1.expect.objectContaining({
                    type: "password",
                    message: globals_1.expect.anything(),
                }),
            ]));
        }));
        (0, globals_1.test)("should return 400 error if password dose not contain both letters and numbers", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser]);
            newUser.password = "1111111";
            const res = yield (0, supertest_1.default)(express_config_1.app)
                .post("/v1/auth/register")
                .send(newUser)
                .expect(http_status_1.default.BAD_REQUEST);
            (0, globals_1.expect)(res.body.errors).toEqual(globals_1.expect.arrayContaining([
                globals_1.expect.objectContaining({
                    type: "password",
                    message: globals_1.expect.anything(),
                }),
            ]));
        }));
    });
    (0, globals_1.describe)("POST /v1/auth/login", () => {
        (0, globals_1.test)("should return 200 and login user if username or email and password match", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser]);
            const loginCredentials = {
                email: auth_fixture_1.tempUser.email,
                password: auth_fixture_1.tempUser.password,
            };
            const res = yield (0, supertest_1.default)(express_config_1.app)
                .post("/v1/auth/login")
                .send(loginCredentials)
                .expect(http_status_1.default.OK);
            (0, globals_1.expect)(res.body.user).toEqual({
                id: globals_1.expect.anything(),
                username: auth_fixture_1.tempUser.username,
                email: auth_fixture_1.tempUser.email,
                verified: false,
                plan: "free",
            });
            (0, globals_1.expect)(res.body.tokens).toEqual({
                access: { token: globals_1.expect.anything(), expires: globals_1.expect.anything() },
                refresh: {
                    token: globals_1.expect.anything(),
                    expires: globals_1.expect.anything(),
                },
            });
        }));
        (0, globals_1.test)("should return 400 error if one of username and email or password dose not entered", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser]);
            const loginCredentials = {
            // userNameOrEmail: tempUser.email,
            // password: tempUser.password,
            };
            yield (0, supertest_1.default)(express_config_1.app)
                .post("/v1/auth/login")
                .send(loginCredentials)
                .expect(http_status_1.default.BAD_REQUEST);
        }));
        (0, globals_1.test)("should return 400 error if password is incorrect", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser]);
            const loginCredentials = {
                userNameOrEmail: auth_fixture_1.tempUser.email,
                password: "randomPassword12347@*&4823",
            };
            yield (0, supertest_1.default)(express_config_1.app)
                .post("/v1/auth/login")
                .send(loginCredentials)
                .expect(http_status_1.default.BAD_REQUEST);
        }));
    });
    (0, globals_1.describe)("POST /v1/auth/logout", () => {
        (0, globals_1.test)("should return 204 if refresh token is valid", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser]);
            const expires = (0, moment_1.default)().add(config_1.config.jwt.refreshExpirationDays, "days");
            const refreshToken = (0, token_service_1.generateToken)(auth_fixture_1.tempUser._id, expires, tokens_1.tokenTypes.REFRESH);
            yield services_1.tokenService.saveToken(refreshToken, auth_fixture_1.tempUser._id, expires, tokens_1.tokenTypes.REFRESH);
            yield (0, supertest_1.default)(express_config_1.app)
                .post("/v1/auth/logout")
                .send({ refreshToken })
                .expect(http_status_1.default.NO_CONTENT);
            const refreshTokenDoc = yield token_1.Token.findOne({ token: refreshToken });
            (0, globals_1.expect)(refreshTokenDoc).toBe(null);
        }));
        (0, globals_1.test)("should return 400 error if refresh token is missing from request body", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(express_config_1.app)
                .post("/v1/auth/logout")
                .send()
                .expect(http_status_1.default.BAD_REQUEST);
        }));
        (0, globals_1.test)("should return 404 error if refresh token is not found in the database", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser]);
            const expires = (0, moment_1.default)().add(config_1.config.jwt.refreshExpirationDays, "days");
            const refreshToken = services_1.tokenService.generateToken(auth_fixture_1.tempUser._id, expires, tokens_1.tokenTypes.REFRESH);
            yield (0, supertest_1.default)(express_config_1.app)
                .post("/v1/auth/logout")
                .send({ refreshToken })
                .expect(http_status_1.default.NOT_FOUND);
        }));
        (0, globals_1.test)("should return 404 error if refresh token is blacklisted", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser]);
            const expires = (0, moment_1.default)().add(config_1.config.jwt.refreshExpirationDays, "days");
            const refreshToken = services_1.tokenService.generateToken(auth_fixture_1.tempUser._id, expires, tokens_1.tokenTypes.REFRESH);
            yield services_1.tokenService.saveToken(refreshToken, auth_fixture_1.tempUser._id, expires, tokens_1.tokenTypes.REFRESH, true);
            yield (0, supertest_1.default)(express_config_1.app)
                .post("/v1/auth/logout")
                .send({ refreshToken })
                .expect(http_status_1.default.NOT_FOUND);
        }));
    });
    (0, globals_1.describe)("POST /v1/auth/refresh-tokens", () => {
        (0, globals_1.test)("should return 200 and new auth tokens if refresh token is valid", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser]);
            const expires = (0, moment_1.default)().add(config_1.config.jwt.refreshExpirationDays, "days");
            const refreshToken = services_1.tokenService.generateToken(auth_fixture_1.tempUser._id, expires, tokens_1.tokenTypes.REFRESH);
            yield services_1.tokenService.saveToken(refreshToken, auth_fixture_1.tempUser._id, expires, tokens_1.tokenTypes.REFRESH);
            const res = yield (0, supertest_1.default)(express_config_1.app)
                .post("/v1/auth/refresh-tokens")
                .send({ refreshToken })
                .expect(http_status_1.default.OK);
            (0, globals_1.expect)(res.body).toEqual({
                access: { token: globals_1.expect.anything(), expires: globals_1.expect.anything() },
                refresh: { token: globals_1.expect.anything(), expires: globals_1.expect.anything() },
            });
            const refreshTokenDoc = yield token_1.Token.findOne({
                token: res.body.refresh.token,
            });
            (0, globals_1.expect)(refreshTokenDoc).toMatchObject({
                type: tokens_1.tokenTypes.REFRESH,
                userId: auth_fixture_1.tempUser._id,
                blacklisted: false,
            });
            const TokensCount = yield token_1.Token.countDocuments();
            (0, globals_1.expect)(TokensCount).toBe(1);
        }));
        (0, globals_1.test)("should return 400 error if refresh token is missing from request body", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(express_config_1.app)
                .post("/v1/auth/refresh-tokens")
                .send()
                .expect(http_status_1.default.BAD_REQUEST);
        }));
        (0, globals_1.test)("should return 401 error if refresh token is signed with invalid secret", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser]);
            const expires = (0, moment_1.default)().add(config_1.config.jwt.refreshExpirationDays, "days");
            const refreshToken = services_1.tokenService.generateToken(auth_fixture_1.tempUser._id, expires, tokens_1.tokenTypes.REFRESH, "invalid secret");
            yield services_1.tokenService.saveToken(refreshToken, auth_fixture_1.tempUser._id, expires, tokens_1.tokenTypes.REFRESH);
            yield (0, supertest_1.default)(express_config_1.app)
                .post("/v1/auth/refresh-tokens")
                .send({ refreshToken })
                .expect(http_status_1.default.UNAUTHORIZED);
        }));
        (0, globals_1.test)("should return 401 error if the token is not found in the database", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser]);
            const expires = (0, moment_1.default)().add(config_1.config.jwt.refreshExpirationDays, "days");
            const refreshToken = services_1.tokenService.generateToken(auth_fixture_1.tempUser._id, expires, tokens_1.tokenTypes.REFRESH, config_1.config.jwt.secret);
            yield (0, supertest_1.default)(express_config_1.app)
                .post("/v1/auth/refresh-tokens")
                .send({ refreshToken })
                .expect(http_status_1.default.UNAUTHORIZED);
        }));
        (0, globals_1.test)("should return 401 error if refresh token is blacklisted", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser]);
            const expires = (0, moment_1.default)().add(config_1.config.jwt.refreshExpirationDays, "days");
            const refreshToken = services_1.tokenService.generateToken(auth_fixture_1.tempUser._id, expires, tokens_1.tokenTypes.REFRESH, config_1.config.jwt.secret);
            yield services_1.tokenService.saveToken(refreshToken, auth_fixture_1.tempUser._id, expires, tokens_1.tokenTypes.REFRESH, true);
            yield (0, supertest_1.default)(express_config_1.app)
                .post("/v1/auth/refresh-tokens")
                .send({ refreshToken })
                .expect(http_status_1.default.UNAUTHORIZED);
        }));
        (0, globals_1.test)("should return 401 error if refresh token is expired", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, auth_fixture_1.insertUsers)([auth_fixture_1.tempUser]);
            const expires = (0, moment_1.default)().subtract(1, "minute");
            const refreshToken = services_1.tokenService.generateToken(auth_fixture_1.tempUser._id, expires, tokens_1.tokenTypes.REFRESH, config_1.config.jwt.secret);
            yield services_1.tokenService.saveToken(refreshToken, auth_fixture_1.tempUser._id, expires, tokens_1.tokenTypes.REFRESH);
            yield (0, supertest_1.default)(express_config_1.app)
                .post("/v1/auth/refresh-tokens")
                .send({ refreshToken })
                .expect(http_status_1.default.UNAUTHORIZED);
        }));
        (0, globals_1.test)("should return 401 error if user is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const expires = (0, moment_1.default)().add(config_1.config.jwt.refreshExpirationDays, "days");
            const refreshToken = services_1.tokenService.generateToken(auth_fixture_1.tempUser._id, expires, tokens_1.tokenTypes.REFRESH, config_1.config.jwt.secret);
            yield services_1.tokenService.saveToken(refreshToken, auth_fixture_1.tempUser._id, expires, tokens_1.tokenTypes.REFRESH);
            yield (0, supertest_1.default)(express_config_1.app)
                .post("/v1/auth/refresh-tokens")
                .send({ refreshToken })
                .expect(http_status_1.default.UNAUTHORIZED);
        }));
    });
});
