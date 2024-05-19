"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const toJson_1 = require("./plugins/toJson");
const OrderSchema = new mongoose_1.default.Schema({
    type: {
        type: String,
        enum: ["order", "waiter", "ember", "bill", "kitchen"],
        required: true,
    },
    order_details: {
        price: String,
        payment_method: String,
        items: [
            {
                name: String,
                count: Number,
                image_url: String,
            },
        ],
    },
    restaurant_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "Restaurant",
    },
    table_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "Table",
    },
    done: { type: Boolean, default: false },
    table_number: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});
OrderSchema.plugin(toJson_1.toJSON);
exports.Order = mongoose_1.default.model("Order", OrderSchema);
