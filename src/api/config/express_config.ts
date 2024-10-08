import express from "express";
import cors from "cors";
import multer from "multer";
import { successHandler, errorHandler as morganErrorHandler } from "./morgan";
import { config } from "./config";
import passport from "passport";
import { jwtStrategy } from "./passport_config";
import parser from "body-parser";
import { errorConverter, errorHandler } from "../middlewares/error";
import httpStatus from "http-status";
import { ApiError } from "../utils/ApiError";
import expressListEndpoints from "express-list-endpoints";
import { initializeRouter } from "../routes/v1/index";

export const initApp = async () => {
  const app = express();

  if (config.env !== "test") {
    app.use(successHandler);
    app.use(morganErrorHandler);
  }

  app.use(cors({ origin: "*" }));

  app.use(parser.json());
  app.use(parser.urlencoded({ extended: true }));
  app.use(multer().none());

  app.use(passport.initialize());
  passport.use("jwt", jwtStrategy);

  const router = await initializeRouter();
  app.use("/v1", router);

  if (config.env === "development") {
    expressListEndpoints(app).forEach((endpoint) => {
      console.log(endpoint.path);
    });
  }

  app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
  });

  app.use(errorConverter);
  app.use(errorHandler);

  return app;
};
