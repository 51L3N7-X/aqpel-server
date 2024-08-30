import express from "express";
export const router = express.Router();

import { getOrders } from "../../../controllers/app/order.controller.app.waiter";
import { getTables } from "../../../controllers/app/getTables.controller";
import { auth } from "../../../middlewares/auth";
import { login } from "../../../controllers/app/auth.controller.app.waiter";
import { validate } from "../../../middlewares/validate";
import { waiterLoginValidate } from "../../../validations/public";

router.post("/login", validate(waiterLoginValidate), login);

router.use(auth());

router.get("/orders", getOrders);

/**
 * @swagger
 * tags:
 *   name: Waiter
 *   description: Waiter routes
 */

/**
 * @swagger
 * /app/waiter/login:
 *   post:
 *     summary: Login
 *     tags: [Waiter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - restaurant_name
 *               - username
 *               - password
 *             properties:
 *               restaurant_name:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               restaurant_name: test
 *               username: test
 *               password: test1234
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Waiter'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               allOf:
 *                 - $ref: '#/components/schemas/Error'
 *                 - type: object
 *                   properties:
 *                     errors:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           message:
 *                             type: string
 *                           type:
 *                             type: string
 *             example:
 *               success: false
 *               code: 400
 *               message: 'Invalid inputs'
 *               errors:
 *                 - message: "'username' is not allowed to be empty"
 *                   type: "username"
 */

/**
 * @swagger
 * /app/waiter/orders:
 *   get:
 *     summary: Get Orders
 *     tags: [Waiter]
 *     security:
 *       - Auth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Order"
 *             examples:
 *               example-1:
 *                 summary: A sample order
 *                 value:
 *                   - id: "66d1fffa0a22fe3588819066"
 *                     type: "waiter"
 *                     order_details:
 *                       items:
 *                         - name: "Spaghetti Carbonara"
 *                           count: 2
 *                           image_url: "https://example.com/images/spaghetti-carbonara.jpg"
 *                         - name: "Caesar Salad"
 *                           count: 1
 *                           image_url: "https://example.com/images/caesar-salad.jpg"
 *                     restaurant_id: "66d1fff90a22fe358881904e"
 *                     table_id: "66d1fff90a22fe3588819049"
 *                     done: false
 *                     table_number: 12
 */
