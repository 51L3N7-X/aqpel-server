import httpStatus from "http-status";
import { Waiter } from "../models/waiter";
import { ApiError } from "../utils/ApiError";
import { Restaurant } from "../models/restaurant";
import { Order } from "../models/order";

export const createWaiter = async (body: Waiter) => {
  const restaurant = await Restaurant.findOne({
    _id: body.restaurantId,
    userId: body.userId,
  });
  if (!restaurant || !Object.keys(restaurant).length)
    throw new ApiError(httpStatus.BAD_REQUEST, "Restaurant not found");
  const waiter = await Waiter.create(body);
  return waiter;
};

export const getWaiterById = async (id: string, userId: string) => {
  const waiter = await Waiter.findOne({ _id: id, userId });
  if (!waiter || !Object.keys(waiter).length)
    throw new ApiError(404, "Waiter not found");
  return waiter;
};

export const getUserWaiters = async (userId: string) => {
  return Waiter.find({ userId }).sort();
};

export const updateWaiterById = async (
  id: string,
  userId: string,
  body: Waiter
) => {
  const waiter = await Waiter.findOne({ userId, _id: id });
  if (!waiter || !Object.keys(waiter).length)
    throw new ApiError(httpStatus.NOT_FOUND, "Waiter not found");
  const restaurant = await Restaurant.findOne({
    _id: body.restaurantId,
    userId,
  });
  if (!restaurant || !Object.keys(restaurant).length)
    throw new ApiError(httpStatus.BAD_REQUEST, "Restaurant not found");
  Object.assign(waiter, body);
  await waiter.save();
  return waiter;
};

export const deleteWaiterById = async (id: string, userId: string) => {
  const waiter = await Waiter.findOne({ userId, _id: id });
  if (!waiter || !Object.keys(waiter).length)
    throw new ApiError(httpStatus.NOT_FOUND, "Waiter not found");
  await waiter.deleteOne();
  return waiter;
};

export const getWaiterByUserNameAndPasswordAndRestaurantId = async (
  username: string,
  password: string,
  restaurantId: string
) => {
  const waiter = await Waiter.findOne({
    username,
    password,
    restaurantId,
  }).select("-userId");
  if (!waiter || !Object.keys(waiter).length)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "The username or password you entered is incorrect. Please try again."
    );
  return waiter;
};

export const getOrdersByWaiterId = async (_id: string) => {
  const waiter = await Waiter.findOne({ _id });
  if (!waiter) throw new ApiError(404, "Waiter not found");
  const orders = await Order.find({
    table_id: { $in: waiter.tables },
    done: false,
  }).sort({ createdAt: 1 });
  return orders;
};
