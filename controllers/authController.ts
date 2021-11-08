import { Conflict, Unauthorized } from "http-errors";

import { RequestHandler } from "express";
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

export { signup, login, logout, getCurrentUser };
