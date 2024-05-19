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
const joi_1 = __importDefault(require("joi"));
const public_1 = require("../../api/validations/public");
const table_1 = require("../../api/models/table");
const order_1 = require("../../api/models/order");
const mongoose_1 = __importDefault(require("mongoose"));
// import redis from "redis";
const connection = (socket, io) => {
    console.log("user connected");
    socket.on("subscribe", (roomId) => {
        if (Array.isArray(roomId)) {
            socket.join(roomId);
        }
        else {
            socket.join(String(roomId));
        }
        // io.to("test").emit("ttt", "hello");
        console.log("joined room", roomId);
    });
    socket.on("disconnect", () => {
        console.log("user disconnected with id : " + socket.id);
    });
    socket.on("order:create", (order) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(order);
        try {
            const { value, error } = joi_1.default.compile(public_1.orderValidate.body)
                .prefs({ errors: { label: "key" } })
                .validate(order);
            if (error) {
                const errorMessage = error.details
                    .map((details) => details.message)
                    .join(", ");
                throw new Error(errorMessage);
            }
            // const restaurant = await Restaurant.findOne({
            //   _id: order.restaurant_id,
            // });
            // if (!restaurant) throw new Error("Restaurant not found");
            const table = yield table_1.Table.findOne({ _id: order.table_id });
            if (!table)
                throw new Error("Table not found");
            const temp_order = yield new order_1.Order(Object.assign(Object.assign({}, order), { table_number: table.number }));
            yield temp_order.save();
            io.to(String(temp_order.table_id)).emit("waiter:order", temp_order);
            io.to(String(temp_order.table_id)).emit("user", {
                message: "done",
                success: true,
            });
        }
        catch (e) {
            io.to(String(order.table_id)).emit("user", {
                messasge: e.message,
                success: false,
            });
        }
    }));
    socket.on("waiter:orderDone", ({ orderId, name, photoUrl, }) => __awaiter(void 0, void 0, void 0, function* () {
        const order = yield order_1.Order.findOne({
            _id: new mongoose_1.default.Types.ObjectId(orderId),
        });
        console.log(order);
        order.done = true;
        yield order.save();
        io.to(String(order.table_id)).emit("waiter:notfiyOrderIsDone", {
            name,
            photoUrl,
            _id: order._id,
        });
    }));
};
exports.default = connection;
