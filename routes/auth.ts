import * as authController from "../controllers/authController";

import { authenticate } from "../middlewares/authMiddleware";
import controllerWrapper from "../middlewares/controllerWrapper";
import express from "express";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import { validationSchema } from "../validations/userValidation";

const router = express.Router();

router.post(
  "/signup",
  validationMiddleware(validationSchema),
  controllerWrapper(authController.signup)
);

router.post(
  "/login",
  validationMiddleware(validationSchema),
  controllerWrapper(authController.login)
);

router.post("/logout", authenticate, controllerWrapper(authController.logout));

module.exports = router;
