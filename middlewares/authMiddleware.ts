import { RequestHandler } from "express";
import { Unauthorized } from "http-errors";
import { UserModel } from "../model/user";

const jwt = require("jsonwebtoken");

const { SECRET_KEY } = process.env;

const authenticate: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    next(new Unauthorized("Not authorized"));
    return;
  }
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(new Unauthorized("Not authorized"));
    return;
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await UserModel.findById(id);
    if (!user) {
      next(new Unauthorized("Not authorized"));
      return;
    }
    req.user = user;
    next();
  } catch (error: any) {
    error.status = 401;
    next(error);
  }
};

export { authenticate };
