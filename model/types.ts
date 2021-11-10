import { ObjectId } from "mongoose";

export interface Contact {
  _id?: ObjectId;
  name: string;
  email: string;
  phone: string;
  favorite?: boolean;
  owner: ObjectId;
}

export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  subscription: Subscription;
  token?: string | null;
  avatarURL?: string;
}

export enum Subscription {
  Starter = "starter",
  Pro = "pro",
  Business = "business",
}
