import {
  afterAll,
  beforeAll,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";
import {
  Server as SocketIOServer,
  type Socket as ServerSocket,
} from "socket.io";
import Client, { type Socket as ClientSocket } from "socket.io-client";
import { createServer } from "http";
import { AddressInfo } from "net";
import connection from "../../../sockets/listeners/SocketManager";
import { insertTheTable, tempTable } from "../../fixtures/table.fixture";
import {
  insertOrders,
  temp_order_with_waiter_type,
} from "../../fixtures/order.fixture";
import { setupDB } from "../../utils/setupDB";
import SocketMock from "socket.io-mock-ts";
import {
  insertWaiter,
  tempWaiter,
  tempWaiterWithTables,
} from "../../fixtures/waiter.fixture";
import { getOrderById } from "../../../sockets/services/order.service";

setupDB();

jest.setTimeout(10000);

describe("Socket test", () => {
  let io: SocketIOServer;
  let serverSocket: ServerSocket;
  let clientSocket: ClientSocket;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new SocketIOServer(httpServer);
    httpServer.listen(() => {
      const port = (httpServer.address() as AddressInfo).port;
      clientSocket = Client(`http://localhost:${port}`);

      io.on("connection", (socket) => {
        serverSocket = socket;
        connection(socket, io);
      });
      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.disconnect();
  });

  test("should join a room on subscribe", async () => {
    await insertTheTable();
    clientSocket.emit("subscribe", tempTable._id.toString());

    serverSocket.on("subscribe", () => {
      expect(serverSocket.rooms.has(tempTable._id.toString())).toBe(true);
    });
  });

  test("should handle order:create event", (done) => {
    insertTheTable().then(() => {
      // const spy = jest.spyOn(serverSocket, "emit");

      clientSocket.emit("order:create", {
        type: "waiter",
        restaurant_id: tempTable.restaurantId.toString(),
        table_id: tempTable._id.toString(),
        table_number: tempTable.number,
      });

      clientSocket.on("waiter:order", (data) => {
        console.log(data);
        expect(data).toHaveProperty("restaurant_id");
        expect(data.table_id).toEqual(tempTable._id.toString());
      });

      // serverSocket.on("order:create", () => {
      //   expect(serverSocket.emit).toHaveBeenCalledWith(
      //     expect.stringContaining("waiter:order"),
      //     expect.objectContaining({
      //       table_id: temp_order_with_waiter_type.table_id.toString(),
      //     })
      //   );
      //   expect(serverSocket.emit).toHaveBeenCalledWith("user");

      // });
      //   await new Promise((resolve) => setTimeout(() => resolve(true), 2000));

      clientSocket.on("user", (value) => {
        console.log(value);
        expect(value).toMatchObject({ message: "done", success: true });
        done();
      });
      //   await new Promise((resolve) => setTimeout(() => resolve(true), 2000));
    });
  });

  test("should handle waiter:orderDone event", (done) => {
    insertOrders([temp_order_with_waiter_type]).then(async () => {
      clientSocket.emit("waiter:orderDone", {
        orderId: temp_order_with_waiter_type._id.toString(),
        name: tempWaiter.name,
      });

      clientSocket.on("waiter:notifyOrderIsDone", async (data) => {
        expect(data.name).toEqual(tempWaiter.name);
        console.log(data);
        const order = await getOrderById(
          temp_order_with_waiter_type._id.toString()
        );

        console.log(order);
        expect(order?.done).toBe(true);
        done();
      });

      // expect(order?.done).toEqual(true);
    });
  });
});
