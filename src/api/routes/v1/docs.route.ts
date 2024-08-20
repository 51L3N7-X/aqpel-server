import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { swaggerDefinition } from "../../docs/index";

export const router = express.Router();
const specs = swaggerJsdoc({
  swaggerDefinition,
  apis: ["src/api/docs/*.yml", "src/api/routes/v1/*.ts"],
});

router.use("/", swaggerUi.serve);
router.get(
  "/",
  swaggerUi.setup(specs, {
    explorer: true,
  })
);
