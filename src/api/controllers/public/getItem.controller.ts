import { Response } from "express";
import { RequestWithUser } from "../../../types/controllers";
import { Item } from "../../models/item";
import { ApiError } from "../../utils/ApiError";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status";

export const getItem = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const item = await Item.findById(req.params.itemId);
    if (!item || Object.keys(item).length <= 0)
      throw new ApiError(404, "Item not found");
    return res.status(httpStatus.OK).send(item);
  }
);

export const getItems = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const items = await Item.find({ menuId: req.params.menuId });
    if (!items) throw new ApiError(404, "Items not found");
    return res.status(httpStatus.OK).send(items);
  }
);
