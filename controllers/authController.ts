import { Conflict, Unauthorized } from "http-errors";

import { RequestHandler } from "express";
import { UserModel } from "../model/user";
import gravatar from "gravatar";
import jwt from "jsonwebtoken";

const { SECRET_KEY } = process.env;

const signup: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });

  if (user) {
    throw new Conflict("Email in use");
  }

  const avatarURL = gravatar.url(email);
  const newUser = new UserModel({ email, avatarURL });
  newUser.setPassword(password);
  const result = await newUser.save();

  res.status(201).json({
    user: result.getShortObject(),
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

  res.json({
    token,
    user: user.getShortObject(),
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

export { signup, login, logout };
