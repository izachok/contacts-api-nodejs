import { Model, Schema, model } from "mongoose";
import { Subscription, User } from "./types";

import bcrypt from "bcryptjs";

interface InstanceMethods {
  setPassword: (password: string) => void;
  comparePassword: (password: string) => Boolean;
}

const userSchema = new Schema<User, Model<User, {}, InstanceMethods>>({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: Subscription,
    default: Subscription.Starter,
  },
  token: {
    type: String,
    default: null,
  },
});

userSchema.methods.setPassword = function (password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const UserModel = model<User, Model<User, {}, InstanceMethods>>(
  "user",
  userSchema
);

export { UserModel };