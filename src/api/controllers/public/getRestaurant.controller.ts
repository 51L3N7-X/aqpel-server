import httpStatus from "http-status";
import { RequestWithUser } from "../../../types/controllers";
import { Restaurant } from "../../models/restaurant";
import { ApiError } from "../../utils/ApiError";
import { catchAsync } from "../../utils/catchAsync";
import { Response } from "express";

export const getRestaurant = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) throw new ApiError(404, "Restaurant not found");
    return res.status(httpStatus.OK).send(restaurant);
  }
);
