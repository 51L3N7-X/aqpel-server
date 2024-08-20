import { describe, expect, test } from "@jest/globals";
import { setupDB } from "../../utils/setupDB";
import {
  insertRestaurants,
  tempRestaurant,
} from "../../fixtures/restaurant.fixture";
import { insertWaiter, tempWaiter } from "../../fixtures/waiter.fixture";
import request from "supertest";
import { app } from "../../../api/config/express_config";
import httpStatus from "http-status";

setupDB();

describe("Auth routes", () => {
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

      expect(res.body).toMatchObject({
        token: expect.anything(),
        waiter: {
          username: tempWaiter.username,
          password: tempWaiter.password,
        },
      });
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

      console.log(res.body);
    });
  });
});
