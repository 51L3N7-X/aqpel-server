import { beforeAll, describe, expect, test } from "@jest/globals";
import { setupDB } from "../../utils/setupDB";
import {
  insertRestaurants,
  tempRestaurant,
} from "../../fixtures/restaurant.fixture";
import {
  insertWaiter,
  insertWaiterWithTables,
  tempWaiter,
  tempWaiterWithTables,
} from "../../fixtures/waiter.fixture";
import request from "supertest";
import httpStatus from "http-status";
import { Express } from "express";
import { getTestApp } from "../../utils/setupTestApp";
import { insertTheTable, tempTable } from "../../fixtures/table.fixture";
import { tempWaiterAccessToken } from "../../fixtures/token.fixture";
import {
  insertOrders,
  temp_order_with_waiter_type,
} from "../../fixtures/order.fixture";

setupDB();

let app: Express;

beforeAll(async () => {
  app = await getTestApp();
});

describe("Waiter routes", () => {
  describe("post /v1/app/waiter/login", () => {
    test("it should return 200 with user data and token", async () => {
      await insertRestaurants([tempRestaurant]);
      await insertWaiter([tempWaiter]);

      const res = await request(app)
        .post("/v1/app/waiter/login")
        .send({
          username: tempWaiter.username,
          password: tempWaiter.password,
          restaurant_name: tempRestaurant.name,
        })
        .expect(httpStatus.OK);
    });

    test("it should return 400 if username or password or restaurant name not entered", async () => {
      await insertRestaurants([tempRestaurant]);
      await insertWaiter([tempWaiter]);

      const res = await request(app)
        .post("/v1/app/waiter/login")
        .send({
          username: "",
          password: "",
          restaurant_name: "",
        })
        .expect(httpStatus.BAD_REQUEST);

      // console.log(res.body);
    });

    test("it should return 400 if username or password is wrong", async () => {
      await insertRestaurants([tempRestaurant]);
      await insertWaiter([tempWaiter]);
    });
  });

  describe("get /v1/app/waiter/orders", () => {
    test("it should return 200 and array of the orders if waiter id is correct and waiter is subscribed to the table", async () => {
      await insertTheTable();
      await insertWaiterWithTables([tempWaiterWithTables]);
      await insertOrders([temp_order_with_waiter_type]);

      const res = await request(app)
        .get("/v1/app/waiter/orders")
        .set({ authorization: tempWaiterAccessToken })
        .expect(httpStatus.OK);

      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            restaurant_id: tempRestaurant._id.toString(),
            table_id: tempTable._id.toString(),
          }),
        ])
      );
    });

    test("it should return 200 and empty array if waiter is not subscribed to the table", async () => {
      await insertTheTable();
      await insertWaiterWithTables([tempWaiter]);
      await insertOrders([temp_order_with_waiter_type]);

      const res = await request(app)
        .get("/v1/app/waiter/orders")
        .set({ authorization: tempWaiterAccessToken })
        .expect(httpStatus.OK);

      expect(res.body).toEqual([]);
    });
  });
});
