// import { auth } from "../../middlewares/auth";

// import { router as userRouter } from "./user.route";
// import { router as restaurantRouter } from "./restaurant.route";
// import { router as waiterRouter } from "./waiter.route";
// import { router as kitchenRouter } from "./kitchen.route";
// import { router as publicRouter } from "./public.route";
// import { router as appRouter } from "./app.route";
// import { router as authRouter } from "./auth.route";
// import { router as floorRouter } from "./floor.route";
// import { router as docsRouter } from "./docs.route";

// import { getUrl } from "../../controllers/dashboard/getS3Url";

// const defaultRouters = [
//   {
//     path: "/auth",
//     route: authRouter,
//   },
//   {
//     path: "/user",
//     route: userRouter,
//   },
//   {
//     path: "/restaurant",
//     route: restaurantRouter,
//   },
//   {
//     path: "/floor",
//     route: floorRouter,
//   },
//   {
//     path: "/waiter",
//     route: waiterRouter,
//   },
//   {
//     path: "/kitchen",
//     route: kitchenRouter,
//   },
//   {
//     path: "/app",
//     route: appRouter,
//   },
//   {
//     path: "/docs",
//     route: docsRouter,
//   },
//   {
//     path: "/",
//     route: publicRouter,
//   },
// ];

// const router = express.Router();

// export const registerRoutes = async (
//   path: string,
//   router: Router
// ): Promise<void> => {
//   const files = readdirSync(path);

//   for (const file of files) {
//     const filePath = resolve(path, file);
//     const status = lstatSync(filePath);

//     if (status.isFile()) {
//       try {
//         const module = await import(filePath);

//         console.log(filePath);

//         router.use(
//           basename(filePath).split(".")[0],
//           module.router || module.default
//         );
//       } catch (error) {
//         console.error(`Error importing module ${filePath}:`, error);
//       }
//     }

//     if (status.isDirectory()) {
//       await registerRoutes(filePath, router);
//     }
//   }
// };

// // Initialize route registration
// registerRoutes(__dirname, router).catch((error) => {
//   console.error("Error registering routes:", error);
// });

// export { router };

// router.get("/getUploadURL", auth(), getUrl);

// defaultRouters.forEach((route) => {
//   router.use(route.path, route.route);
// });

// import express, { Router } from "express";
// import { readdirSync, lstatSync } from "fs";
// import { basename, join, resolve } from "path";

// const registerRoutes = async (
//   basePath: string,
//   currentPath: string,
//   router: Router
// ): Promise<void> => {
//   const files = readdirSync(currentPath);

//   for (const file of files) {
//     const filePath = resolve(currentPath, file);
//     const status = lstatSync(filePath);

//     if (status.isFile() && file.endsWith(".route.ts")) {
//       try {
//         const module = await import(filePath);
//         const routeName = basename(file, ".route.ts");
//         const routePath = filePath
//           .replace(basePath, "")
//           .replace(/\\/g, "/")
//           .split("/")
//           .filter((segment) => segment !== routeName && segment !== "")
//           .join("/");

//         router.use(
//           `/${routePath}/${routeName}`.replace(/\/+/g, "/"),
//           module.router || module.default
//         );
//       } catch (error) {
//         console.error(`Error importing module ${filePath}:`, error);
//       }
//     }

//     if (status.isDirectory()) {
//       await registerRoutes(basePath, filePath, router);
//     }
//   }
// };

// export const initializeRouter = async (): Promise<Router> => {
//   const router = express.Router();
//   const basePath = resolve(__dirname);

//   try {
//     await registerRoutes(basePath, basePath, router);
//   } catch (error) {
//     console.error("Error registering routes:", error);
//   }

//   return router;
// };

// import express, { Router } from "express";
// import { readdirSync, lstatSync } from "fs";
// import { basename, join, resolve, relative } from "path";

// const registerRoutes = async (
//   basePath: string,
//   currentPath: string,
//   router: Router
// ): Promise<void> => {
//   const files = readdirSync(currentPath);

//   for (const file of files) {
//     const filePath = resolve(currentPath, file);
//     const status = lstatSync(filePath);

//     if (status.isFile() && file.endsWith(".route.ts")) {
//       try {
//         const module = await import(filePath);
//         const relativePath = relative(basePath, currentPath);
//         let routeName = basename(file, ".route.ts");

//         const routePath = join("/", relativePath, routeName).replace(
//           /\\/g,
//           "/"
//         );

//         router.use(routePath, module.router || module.default);
//         console.log(`Registered route: ${routePath}`);
//       } catch (error) {
//         console.error(`Error importing module ${filePath}:`, error);
//       }
//     }

//     if (status.isDirectory()) {
//       await registerRoutes(basePath, filePath, router);
//     }
//   }
// };

// export const initializeRouter = async (): Promise<Router> => {
//   const router = express.Router();
//   const basePath = resolve(__dirname);

//   try {
//     await registerRoutes(basePath, basePath, router);
//   } catch (error) {
//     console.error("Error registering routes:", error);
//   }

//   return router;
// };

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
