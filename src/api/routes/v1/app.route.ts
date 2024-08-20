import express from "express";
export const router = express.Router();

// import { login } from "../../controllers/app/login.controller";
import { getOrders } from "../../controllers/app/getOrders.controller";

import { getTables } from "../../controllers/app/getTables.controller";
import { auth } from "../../middlewares/auth";
import { login } from "../../controllers/app/auth.controller.app.waiter";
import { validate } from "../../middlewares/validate";
import { waiterLoginValidate } from "../../validations/public";

// router.post("/login", login);

router.post("/waiter/login", validate(waiterLoginValidate), login);

router.use(auth());

router.get("/getOrders", getOrders);
router.get("/getTables", getTables);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /app/waiter/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
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
