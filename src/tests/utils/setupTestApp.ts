import { initApp } from "../../api/config/express_config";
import { Express } from "express";

let app: Express;

export const getTestApp = async () => {
  if (!app) {
    app = await initApp();
  }

  return app;
};
