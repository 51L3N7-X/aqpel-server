// index.ts

import { constants } from "./api/constants/index";
import { initApp } from "./api/config/express_config";
import http from "http";
import { SocketServerClass } from "./sockets/Server";
import { connectDB } from "./api/config/database_config";
import { config } from "./api/config/config";
import { print } from "./api/utils/printEndPoints";
import { logger } from "./api/config/logger";

const startServer = async () => {
  const exitHandler = (server: any) => {
    if (server) {
      server.close(() => {
        logger.info("Server closed");
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  const unexpectedErrorHandler = (error: any, server: any) => {
    logger.error(error);
    exitHandler(server);
  };

  try {
    await connectDB(config.mongoose.url, config.mongoose.options);

    const app = await initApp(); // Wait for the app to initialize, including route registration

    // app._router.stack.forEach(print.bind(null, []));

    const server = http.createServer();
    server.on("request", app);

    await new Promise((resolve) =>
      server.listen({ port: config.port }, () => resolve(undefined))
    );

    await new SocketServerClass(server).init();

    logger.info(`Listening to port ${config.port}`);

    process.on("uncaughtException", unexpectedErrorHandler);
    process.on("unhandledRejection", unexpectedErrorHandler);

    process.on("SIGTERM", () => {
      logger.info("SIGTERM received");
      if (server) {
        server.close();
      }
    });
  } catch (err) {
    logger.info(err);
    process.exit(2);
  }
};

startServer();
