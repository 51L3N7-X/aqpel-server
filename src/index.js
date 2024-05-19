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
const express_config_1 = require("./api/config/express_config");
const http_1 = __importDefault(require("http"));
const database_config_1 = require("./api/config/database_config");
const config_1 = require("./api/config/config");
const printEndPoints_1 = require("./api/utils/printEndPoints");
const logger_1 = require("./api/config/logger");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const exitHandler = (server) => {
        if (server) {
            server.close(() => {
                logger_1.logger.info("Server closed");
                process.exit(1);
            });
        }
        else {
            process.exit(1);
        }
    };
    const unexpectedErrorHandler = (error, server) => {
        logger_1.logger.error(error);
        exitHandler(server);
    };
    try {
        express_config_1.app._router.stack.forEach(printEndPoints_1.print.bind(null, []));
        yield (0, database_config_1.connectDB)(config_1.config.mongoose.url, config_1.config.mongoose.options);
        const server = http_1.default.createServer();
        server.on("request", express_config_1.app);
        yield new Promise((resolve) => server.listen({ port: config_1.config.port }, () => resolve(undefined)));
        // await new SocketServerClass(server).init();
        logger_1.logger.info(`Listening to port ${config_1.config.port}`);
        process.on("uncaughtException", unexpectedErrorHandler);
        process.on("unhandledRejection", unexpectedErrorHandler);
        process.on("SIGTERM", () => {
            logger_1.logger.info("SIGTERM received");
            if (server) {
                server.close();
            }
        });
    }
    catch (err) {
        logger_1.logger.info(err);
        process.exit(2);
    }
}))();
