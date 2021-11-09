import * as userController from "../controllers/userController";

import { authenticate } from "../middlewares/authMiddleware";
import controllerWrapper from "../middlewares/controllerWrapper";
import express from "express";
import { upload } from "../middlewares/uploadMiddleware";

const router = express.Router();

router.get(
  "/current",
  authenticate,
  controllerWrapper(userController.getCurrentUser)
);

router.patch(
  "/",
  authenticate,
  controllerWrapper(userController.updateSubscription)
);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  controllerWrapper(userController.updateAvatar)
);

module.exports = router;
