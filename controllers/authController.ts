import { BadRequest, Conflict, NotFound, Unauthorized } from "http-errors";

import { RequestHandler } from "express";
import { Subscription } from "../model/types";
import { UserModel } from "../model/user";
import jwt from "jsonwebtoken";

const { SECRET_KEY } = process.env;

const signup: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });

  if (user) {
    throw new Conflict("Email in use");
  }
  const newUser = new UserModel({ email });
  newUser.setPassword(password);
  const result = await newUser.save();

  //todo filter result without password and token
  res.status(201).json({
    user: result,
  });
};

const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user || !user.comparePassword(password)) {
    throw new Unauthorized(`Wrong email or password`);
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY!);

  user.token = token;
  await user.save();

  //todo filter results
  res.json({
    token,
    user,
  });
};

const logout: RequestHandler = async (req, res) => {
  const { _id } = req.user!;
  const user = await UserModel.findById(_id);
  if (!user) {
    throw new Unauthorized("Not authorized");
  }
  user.token = null;
  await user.save();
  res.status(204).send();
};

const getCurrentUser: RequestHandler = async (req, res) => {
  const { _id } = req.user!;
  const user = await UserModel.findById(_id);

  //todo filter response fields
  res.json(user);
};

const updateSubscription: RequestHandler = async (req, res) => {
  const { _id } = req.user!;
  const { subscription } = req.body;
  if (subscription == undefined) {
    throw new BadRequest("missing field subscription");
  }
  //check is value in enum
  if (!Object.values(Subscription).includes(subscription)) {
    throw new BadRequest("invalid subscription value");
  }

  const user = await UserModel.findById(_id);
  if (!user) {
    throw new NotFound("Not found");
  }
  user.subscription = subscription;
  const result = await user.save();
  //todo filter results
  res.status(200).json(result);
};

export { signup, login, logout, getCurrentUser, updateSubscription };
