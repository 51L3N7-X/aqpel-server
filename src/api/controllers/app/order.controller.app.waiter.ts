import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { getOrdersByWaiterId } from "../../services/waiter.service";
import httpStatus from "http-status";

interface RequestWithUser extends Request {
  user: {
    id: string;
  };
}

export const getOrders = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const orders = await getOrdersByWaiterId(req.user.id);
    return res.status(httpStatus.OK).send(orders);
  }
);
