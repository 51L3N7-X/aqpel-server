import express, { Router } from "express";
import { readdirSync, lstatSync } from "fs";
import { basename, join, resolve, relative } from "path";
import { config } from "../../config/config";

const registerRoutes = async (
  basePath: string,
  currentPath: string,
  router: Router
): Promise<void> => {
  const files = readdirSync(currentPath);
  console.log(currentPath);

  for (const file of files) {
    const filePath = resolve(currentPath, file);
    const status = lstatSync(filePath);

    if (
      status.isFile() &&
      (file.endsWith(".route.ts") || file.endsWith(".route.js"))
    ) {
      try {
        const module = await import(filePath);
        const relativePath = relative(basePath, currentPath);
        let routeName = basename(file, ".route.ts");

        if (config.env == "production") routeName = basename(file, ".route.js");
        const routePath = join("/", relativePath, routeName).replace(
          /\\/g,
          "/"
        );

        router.use(routePath, module.router || module.default);
        // console.log(`Registered route: ${routePath}`);
      } catch (error) {
        console.error(`Error importing module ${filePath}:`, error);
      }
    }

    if (status.isDirectory()) {
      await registerRoutes(basePath, filePath, router);
    }
  }
};

export const initializeRouter = async (): Promise<Router> => {
  const router = express.Router();
  const basePath = resolve(__dirname);

  try {
    await registerRoutes(basePath, basePath, router);
    console.log("All routes registered successfully");
  } catch (error) {
    console.error("Error registering routes:", error);
  }

  return router;
};
