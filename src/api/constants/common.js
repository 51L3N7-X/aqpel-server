"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.common = void 0;
const _1 = require(".");
exports.common = {
    port: _1.constants.port,
    database_uri: process.env.MONGO_DB_URL,
};
console.log("test");
