"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middlewares/auth");
const user_route_1 = require("./user.route");
const restaurant_route_1 = require("./restaurant.route");
const waiter_route_1 = require("./waiter.route");
const kitchen_route_1 = require("./kitchen.route");
const public_route_1 = require("./public.route");
const app_route_1 = require("./app.route");
const auth_route_1 = require("./auth.route");
const floor_route_1 = require("./floor.route");
const getS3Url_1 = require("../../controllers/dashboard/getS3Url");
const defaultRouters = [
    {
        path: "/auth",
        route: auth_route_1.router,
    },
    {
        path: "/user",
        route: user_route_1.router,
    },
    {
        path: "/restaurant",
        route: restaurant_route_1.router,
    },
    {
        path: "/floor",
        route: floor_route_1.router,
    },
    {
        path: "/waiter",
        route: waiter_route_1.router,
    },
    {
        path: "/kitchen",
        route: kitchen_route_1.router,
    },
    {
        path: "/app",
        route: app_route_1.router,
    },
    {
        path: "/",
        route: public_route_1.router,
    },
];
exports.router = express_1.default.Router();
exports.router.get("/getUploadURL", (0, auth_1.auth)(), getS3Url_1.getUrl);
defaultRouters.forEach((route) => {
    exports.router.use(route.path, route.route);
});
