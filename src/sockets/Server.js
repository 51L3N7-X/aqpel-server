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
exports.SocketServerClass = void 0;
// const { App } = require("uWebSockets.js");
const socket_io_1 = require("socket.io");
const SokcetManager_1 = __importDefault(require("./listeners/SokcetManager"));
class SocketServerClass {
    constructor(server) {
        this.server = server;
        // this.app = App();
        this.io = new socket_io_1.Server(this.server, {
            allowUpgrades: true,
            cors: {
                origin: "http://localhost:3000",
            },
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            // // this.io.attachApp(this.app);
            // const redisClientPub = redis.createClient();
            // await redisClientPub.connect();
            // // creating a redis subscriber
            // const redisClientSub = redisClientPub.duplicate();
            // await redisClientSub.connect();
            this.io.on("connection", (socket) => (0, SokcetManager_1.default)(socket, this.io));
        });
    }
}
exports.SocketServerClass = SocketServerClass;
