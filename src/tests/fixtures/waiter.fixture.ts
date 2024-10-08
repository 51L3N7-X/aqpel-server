import mongoose from "mongoose";
import { tempUser } from "./auth.fixture";
import { faker } from "@faker-js/faker";
import { Waiter } from "../../api/models/waiter";
import { tempRestaurant } from "./restaurant.fixture";
import { tempTable } from "./table.fixture";

export const tempWaiter = {
  username: "username123",
  password: "password123$",
  _id: new mongoose.Types.ObjectId(),
  userId: tempUser._id,
  restaurantId: tempRestaurant._id,
  name: faker.person.firstName(),
};

export const tempWaiterWithTables = {
  ...tempWaiter,
  tables: [tempTable._id],
};

export const insertWaiter = async (waiters: any[]) => {
  await Waiter.insertMany(waiters);
};

export const insertWaiterWithTables = async (waiters: any[]) => {
  await Waiter.insertMany(waiters);
};
