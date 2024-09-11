import type { Socket } from "socket.io";
import { Order as OrderType } from "../types/order";
import { subscribe } from "../services/socket.service";
import { createOrder, updateOrderById } from "../services/order.service";
import { getTableById } from "../services/table.service";
import { joiValidate } from "../utils/joiValidate";
import { orderValidate } from "../validation/order";

const connection = (socket: Socket, io: any) => {
  console.log("user connected");

  socket.on("subscribe", (roomId: string | string[]) =>
    subscribe(socket, roomId)
  );

  socket.on("disconnect", () => {
    console.log("user disconnected with id : " + socket.id);
  });

  socket.on("order:create", async (order: OrderType) => {
    // console.log(order);
    try {
      // const { value, error } = Joi.compile(orderSchema.body)
      //   .prefs({ errors: { label: "key" } })
      //   .validate(order);

      // if (error) {
      //   const errorMessage: any = error.details
      //     .map((details) => details.message)
      //     .join(", ");
      //   throw new Error(errorMessage);
      // }

      // // const restaurant = await Restaurant.findOne({
      // //   _id: order.restaurant_id,
      // // });

      // // if (!restaurant) throw new Error("Restaurant not found");

      // const table = await Table.findOne({ _id: order.table_id });

      // if (!table) throw new Error("Table not found");

      // const temp_order = await new Order({
      //   ...order,
      //   table_number: table.number,
      // });
      // await temp_order.save();

      const table = await getTableById(order.table_id);

      console.log(table);

      if (!table) {
        throw new Error("Table not found");
      }

      const new_order = await createOrder(order, table.number);

      // console.log(new_order);

      io.to(String(new_order.table_id)).emit("waiter:order", new_order);

      io.to(String(new_order.table_id)).emit("user", {
        message: "done",
        success: true,
      });
    } catch (e: any) {
      // console.log(e);
      io.to(String(order.table_id)).emit("user", {
        message: e.message,
        success: false,
      });
    }
  });

  socket.on(
    "waiter:orderDone",
    async ({
      orderId,
      name,
      photoUrl = "",
    }: {
      orderId: any;
      name: string;
      photoUrl: string;
    }) => {
      try {
        const updatedOrder = await updateOrderById(orderId, { done: true });

        console.log(updatedOrder);

        io.to(String(updatedOrder.table_id)).emit("waiter:notifyOrderIsDone", {
          name,
          photoUrl,
          _id: updatedOrder._id,
        });
      } catch (e: any) {
        console.error(`Error marking order as done: ${e.message}`);
        // io.to(String(order.table_id)).emit("waiter:notfiyOrderIsDone", {
        //   message: e.message,
        //   success: false,
        // });
      }
      // const order: any = await Order.findOne({
      //   _id: new mongoose.Types.ObjectId(orderId),
      // });
      // console.log(order);

      // order.done = true;

      // await order.save();
    }
  );
};

export default connection;
