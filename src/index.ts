import { constants } from "./api/constants/index";
import { initApp } from "./api/config/express_config";
import http from "http";
import { SocketServerClass } from "./sockets/Server";
import { connectDB } from "./api/config/database_config";
import { config } from "./api/config/config";
import { logger } from "./api/config/logger";

const startServer = async () => {
  let server: http.Server;

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info("Server closed");
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  const unexpectedErrorHandler = (error: Error) => {
    logger.error(error);
    exitHandler();
  };

  try {
    await connectDB(config.mongoose.url, config.mongoose.options);

    const app = await initApp();

    server = http.createServer(app);

    await new Promise<void>((resolve) =>
      server.listen(config.port, () => {
        logger.info(`Listening to port ${config.port}`);
        resolve();
      })
    );

    await new SocketServerClass(server).init();

    process.on("uncaughtException", unexpectedErrorHandler);
    process.on("unhandledRejection", (reason: Error) => {
      logger.error(`Unhandled Rejection: ${reason.message || reason}`);
    });

    process.on("SIGTERM", () => {
      logger.info("SIGTERM received");
      if (server) {
        server.close(() => {
          logger.info("Server closed");
          process.exit(0);
        });
      }
    });

    process.on("SIGINT", () => {
      logger.info("SIGINT received");
      if (server) {
        server.close(() => {
          logger.info("Server closed");
          process.exit(0);
        });
      }
    });
  } catch (err) {
    logger.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer().catch((err) => {
  logger.error("Unhandled error in startServer:", err);
  process.exit(1);
});
