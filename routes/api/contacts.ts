import * as contactsController from "../../controllers/contactsController";

import {
  validationSchema,
  validationSchemaOptional,
} from "../../validations/contactValidation";

import { authenticate } from "../../middlewares/authMiddleware";
import controllerWrapper from "./../../middlewares/controllerWrapper";
import express from "express";
import { validationMiddleware } from "../../middlewares/validationMiddleware";

const router = express.Router();

router.get("/", authenticate, controllerWrapper(contactsController.getAll));

router.get(
  "/:contactId",
  authenticate,
  controllerWrapper(contactsController.getById)
);

router.post(
  "/",
  authenticate,
  validationMiddleware(validationSchema),
  controllerWrapper(contactsController.add)
);

router.delete(
  "/:contactId",
  authenticate,
  controllerWrapper(contactsController.deleteById)
);

router.put(
  "/:contactId",
  authenticate,
  validationMiddleware(validationSchemaOptional),
  controllerWrapper(contactsController.updateById)
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  controllerWrapper(contactsController.updateStatusContact)
);

module.exports = router;
