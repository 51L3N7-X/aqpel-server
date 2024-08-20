import { version } from "../../../package.json";
import { config } from "../config/config";
import { constants } from "../constants";
const servers = [];

process.env.NODE_ENV == "development"
  ? servers.push({
      url: `http://localhost:${config.port}/v1`,
      description: "Development server",
    })
  : servers.push({
      url: `${constants.production_url}/v1`,
      description: "Production server",
    });

export const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Aqpel API documentation",
    version,
  },
  servers,
};
