import Joi from "joi";
import { objectId } from "../../api/validations/utils/custom";

export const orderValidate = Joi.object().keys({
  type: Joi.string().required().valid("order", "waiter", "embers", "bill"),
  restaurant_id: Joi.string().required().custom(objectId),
  table_id: Joi.string().required().custom(objectId),
  table_number: Joi.number().required(),
  order_details: Joi.object({
    price: Joi.string().required(),
  }).optional(),
});
