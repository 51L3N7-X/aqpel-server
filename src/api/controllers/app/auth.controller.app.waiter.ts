import { findRestaurantByName } from "../../services/restaurant.service";
import { generateWaiterToken } from "../../services/token.service";
import { getWaiterByUserNameAndPasswordAndRestaurantId } from "../../services/waiter.service";
import { ApiError } from "../../utils/ApiError";
import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";

export const login = catchAsync(async (req: Request, res: Response) => {
  if (req.headers.authorization) throw new ApiError(400, "Authenticated");

  const { restaurant_name, username, password } = req.body;

  const restaurant = await findRestaurantByName(restaurant_name);

  const waiter = await getWaiterByUserNameAndPasswordAndRestaurantId(
    username,
    password,
    restaurant.id
  );

  const waiterToken = generateWaiterToken(waiter.id);

  res.status(200).json({ success: true, token: waiterToken, waiter });
});
