import express, { ErrorRequestHandler } from "express";

const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

const contactsRouter = require("./routes/api/contacts");
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/contacts", contactsRouter);
app.use("/users", authRouter);
app.use("/users", usersRouter);

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
