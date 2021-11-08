import express from "express";
import { User } from "../../model/types";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
