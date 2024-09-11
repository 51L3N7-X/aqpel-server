import express from "express";
export const router = express.Router();

import {
  getUser,
  modifyUser,
  deleteUser,
} from "../../controllers/dashboard/user.controller";

import { auth } from "../../middlewares/auth";
import { getUrl } from "../../controllers/dashboard/getS3Url";

//verify
router.use(auth());

// main requests for user
router.get("/", getUser);
router.patch("/", modifyUser);
router.delete("/", deleteUser);
router.get("/getUploadURL", getUrl);
