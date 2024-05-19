"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constants = void 0;
const dotenv_1 = require("dotenv");
const path_1 = require("path");
(0, dotenv_1.config)({ path: (0, path_1.join)(__dirname, "../../.env") });
const common_1 = require("./common");
exports.constants = Object.assign(common_1.common, process.env);
