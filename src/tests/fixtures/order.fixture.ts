import mongoose from "mongoose";
import { tempRestaurant } from "./restaurant.fixture";
import { tempTable } from "./table.fixture";
import { Order } from "../../api/models/order";

export const temp_order_with_waiter_type = {
  _id: new mongoose.Types.ObjectId(),
  type: "waiter",
  restaurant_id: tempRestaurant._id,
  table_id: tempTable._id,
  table_number: tempTable.number,
};

export const insertOrders = async (orders: any[]) => {
  await Order.insertMany(orders);
};
