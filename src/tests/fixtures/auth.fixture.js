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
exports.insertUsers = exports.tempUser2 = exports.tempUser = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = require("../../api/models/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const faker_1 = require("@faker-js/faker");
const password = "password1";
const salt = bcrypt_1.default.genSaltSync(8);
const hashedPassword = bcrypt_1.default.hashSync(password, salt);
exports.tempUser = {
    _id: new mongoose_1.default.Types.ObjectId(),
    username: faker_1.faker.person.firstName().toLowerCase(),
    email: faker_1.faker.internet.email().toLowerCase(),
    password,
    verified: false,
    plan: "free",
};
exports.tempUser2 = {
    _id: new mongoose_1.default.Types.ObjectId(),
    username: faker_1.faker.person.firstName().toLowerCase(),
    email: faker_1.faker.internet.email().toLowerCase(),
    password,
    verified: false,
    plan: "free",
};
const insertUsers = (users) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_1.User.insertMany(users.map((user) => (Object.assign(Object.assign({}, user), { password: hashedPassword }))));
});
exports.insertUsers = insertUsers;
