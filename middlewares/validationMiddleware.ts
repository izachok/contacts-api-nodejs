import httpErrors, { BadRequest } from "http-errors";

import { MixedSchema } from "yup/lib/mixed";
import { RequestHandler } from "express";
import { ValidationError } from "yup";

const validationMiddleware = (schema: MixedSchema) => {
  const validation: RequestHandler = async (req, _, next) => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        error = new BadRequest(error.errors.join(", "));
      }
      next(error);
    }
  };

  return validation;
};

export { validationMiddleware };
