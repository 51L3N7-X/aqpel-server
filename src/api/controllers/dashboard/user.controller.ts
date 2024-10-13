import { User } from "../../models/user";
import bcrypt from "bcrypt";
import { catchAsync } from "../../utils/catchAsync";
import { RequestWithUser } from "../../../types/controllers";
import { Response } from "express";
import { ApiError } from "../../utils/ApiError";
import httpStatus from "http-status";
import { getUserById, updateUser } from "../../services/user.service";

export const getUser = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const user = await getUserById(req.user.id);
    res.status(httpStatus.OK).send(user);
  }
);

export const modifyUser = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const user = await updateUser(req.user.id, req.body);
    return res.status(httpStatus.OK).send(user);
  }
);

export const deleteUser = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    await User.findByIdAndDelete(req.user.id);
    res.send({ success: true });
  }
);
