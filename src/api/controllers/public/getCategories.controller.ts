import httpStatus from "http-status";
import { RequestWithUser } from "../../../types/controllers";
import { Category } from "../../models/category";
import { ApiError } from "../../utils/ApiError";
import { catchAsync } from "../../utils/catchAsync";
import { Response } from "express";

export const getCategories = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const categories = await Category.find({
      menuId: req.params.menuId,
    });
    if (!categories) throw new ApiError(404, "Categories not found");
    return res.status(httpStatus.OK).send(categories);
  }
);
