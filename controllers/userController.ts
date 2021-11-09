import { BadRequest, NotFound } from "http-errors";

import Jimp from "jimp";
import { RequestHandler } from "express";
import { Subscription } from "../model/types";
import { UserModel } from "../model/user";
import path from "path";

const fs = require("fs/promises");

const getCurrentUser: RequestHandler = async (req, res) => {
  const { _id } = req.user!;
  const user = await UserModel.findById(_id);

  res.json(user?.getShortObject());
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
  res.status(200).json(result.getShortObject());
};

const updateAvatar: RequestHandler = async (req, res, next) => {
  const { _id } = req.user!;
  if (!req.file) {
    throw new BadRequest("Please upload file");
  }
  const { path: tempPath, originalname } = req.file;
  const [extension] = originalname.split(".").reverse();
  const filename = `${_id}.${extension}`;

  const uploadDir = path.join(__dirname, "../", "public/avatars", filename);
  try {
    //convert image
    const file = await Jimp.read(tempPath);
    file.resize(250, 250).write(tempPath);

    //move to public directory
    await fs.rename(tempPath, uploadDir);
    const image = path.join("avatars", filename);
    const result = await UserModel.findByIdAndUpdate(
      _id,
      { avatarURL: image },
      {
        new: true,
      }
    );
    res.json({
      avatarURL: result?.avatarURL,
    });
  } catch (error) {
    await fs.unlink(tempPath);
    next(error);
  }
};

export { getCurrentUser, updateSubscription, updateAvatar };
