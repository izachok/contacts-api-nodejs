export {};

import express, { ErrorRequestHandler } from "express";

const logger = require("morgan");
const cors = require("cors");

const contactsRouter = require("./routes/api/contacts");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.message);
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
};
app.use(errorHandler);

module.exports = app;
