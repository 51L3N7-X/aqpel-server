import { Order } from "../../api/models/order";
import { Order as OrderType } from "../types/order";
import { joiValidate } from "../utils/joiValidate";
import { orderValidate } from "../validation/order";
import { getTableById } from "./table.service";

export const createOrder = async (order: OrderType, table_number: string) => {
  joiValidate(orderValidate, order);

  const table = await getTableById(order.table_id);

  if (!table) throw new Error("Table not found");

  return Order.create({ ...order, table_number });
};

export const getOrderById = async (orderId: string) => {
  return Order.findById(orderId);
};

export const updateOrderById = async (orderId: string, updateBody: any) => {
  const order = await getOrderById(String(orderId));
  if (!order) {
    throw new Error("Order not found");
  }
  Object.assign(order, updateBody);
  await order.save();

  return order;
};
