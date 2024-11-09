import express from "express";
import { getTable } from "../../controllers/public/getTables.controller";
import { postOrder } from "../../controllers/public/order.controller";
import { validate } from "../../middlewares/validate";
import { orderValidate } from "../../validations/public";
import { getItem, getItems } from "../../controllers/public/getItem.controller";
import { getCategories } from "../../controllers/public/getCategories.controller";
import { getRestaurant } from "../../controllers/public/getRestaurant.controller";

export const router = express.Router();

router.post("/order", validate(orderValidate), postOrder);
router.get("/:tableId", getTable);
// router.get("/:restaurantId/menu", getMenu);
router.get("/item/:itemId", getItem);
router.get("/:menuId/items", getItems);
router.get("/:menuId/categories", getCategories);
router.get("/restaurant/:restaurantId", getRestaurant);
