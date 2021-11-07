import { RequestHandler } from "express";

const controllerWrapper = (ctrl: RequestHandler) => {
  const controller: RequestHandler = async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      next(error);
    }
  };

  return controller;
};

export default controllerWrapper;
