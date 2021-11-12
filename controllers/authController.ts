import { BadRequest, Conflict, NotFound, Unauthorized } from "http-errors";

import { RequestHandler } from "express";
import { UserModel } from "../model/user";
import gravatar from "gravatar";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";
import { v4 as uuidv4 } from "uuid";

const { SECRET_KEY } = process.env;
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const sendEmail = async (email: string, verificationToken: string | null) => {
  const msg = {
    to: email,
    from: "olga.tiutiunnyk@meta.ua",
    subject: "Thank you for registration! Confirm Your Email",
    text: `Please, confirm your email address. By clicking on the following link, you are confirming your email address: http://localhost:3000/users/verify/${verificationToken}`,
    html: `Please, confirm your email address. By clicking on the following link, you are confirming your email address: <a target='_blank'href="http://localhost:3000/users/verify/${verificationToken}">confirm email</a>`,
  };

  await sgMail.send(msg);
};

const signup: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });

  if (user) {
    throw new Conflict("Email in use");
  }

  const verificationToken = uuidv4();

  const avatarURL = gravatar.url(email);
  const newUser = new UserModel({ email, avatarURL, verificationToken });
  newUser.setPassword(password);
  const result = await newUser.save();

  await sendEmail(email, verificationToken);

  res.status(201).json({
    user: result.getShortObject(),
  });
};

const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user || !user.verify || !user.comparePassword(password)) {
    throw new Unauthorized(`Wrong email or password or not verified email`);
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

const verify: RequestHandler = async (req, res) => {
  const user = await UserModel.findOne({
    verificationToken: req.params.verificationToken,
  });
  if (!user) {
    throw new NotFound("User not found");
  }
  user.verificationToken = null;
  user.verify = true;
  await user.save();

  res.json({ message: "Verification successful" });
};

const repeatVerification: RequestHandler = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequest("missing required field email");
  }
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new NotFound(`User with email ${email} was not found`);
  }
  if (user.verify) {
    throw new BadRequest("Verification has already been passed");
  }
  await sendEmail(email, user.verificationToken!);
  res.json({ message: "Verification email sent" });
};

export { signup, login, logout, verify, repeatVerification };
