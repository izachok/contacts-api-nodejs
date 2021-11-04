import * as contactsController from "../../controllers/contactsController";

import {
  validationSchema,
  validationSchemaOptional,
} from "../../validations/contactValidation";

import controllerWrapper from "./../../middlewares/controllerWrapper";
import express from "express";
import { validationMiddleware } from "../../middlewares/validationMiddleware";

const router = express.Router();

router.get("/", controllerWrapper(contactsController.getAll));

router.get("/:contactId", controllerWrapper(contactsController.getById));

router.post(
  "/",
  validationMiddleware(validationSchema),
  controllerWrapper(contactsController.add)
);

router.delete("/:contactId", controllerWrapper(contactsController.deleteById));

router.put(
  "/:contactId",
  validationMiddleware(validationSchemaOptional),
  controllerWrapper(contactsController.updateById)
);

module.exports = router;
