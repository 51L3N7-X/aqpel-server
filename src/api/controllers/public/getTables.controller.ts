import { Table } from "../../models/table";
import { Restaurant } from "../../models/restaurant";
import { catchAsync } from "../../utils/catchAsync";
import { RequestWithUser } from "../../../types/controllers";
import { Response } from "express";
import { ApiError } from "../../utils/ApiError";
import httpStatus from "http-status";

export const getTable = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const table = await Table.findById(req.params.tableId);
    if (!table) throw new ApiError(404, "Table not found");
    return res.status(httpStatus.OK).send(table);
  }
);

// export const getMenu = catchAsync(
//   async (req: RequestWithUser, res: Response) => {
//     const restaurant = await Restaurant.findOne({
//       _id: req.params.restaurantId,
//     })
//       .populate({
//         path: "menu",
//         select: "-userId",
//         populate: {
//           path: "categories",
//           select: "-userId",
//           populate: {
//             path: "items",
//             select: "-userId",
//           },
//         },
//       })
//       .select("-userId");
//     return res.status(200).send({ restaurant });
//   }
// );
