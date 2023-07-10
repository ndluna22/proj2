"use strict";

/** Express app for jobly. */

const express = require("express"); //import express
const cors = require("cors"); //API security

const { NotFoundError } = require("./expressError"); //{} prevents variable to be assigned to another variable

const { authenticateJWT } = require("./middleware/auth"); //import contents of jwt from auth file middleware folder
const authRoutes = require("./routes/auth"); //imports contents of auth.js file from routes folder
const companiesRoutes = require("./routes/companies"); //imports contents ofcompanies.js file from routes folder
const usersRoutes = require("./routes/users"); //imports contents of users.js file from routes folder
const jobsRoutes = require("./routes/jobs"); //added job routes

const morgan = require("morgan"); //external middleware: HTTP request logger middleware

const app = express(); //similar to app=Flask(__name__)

//applies to all requests
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/companies", companiesRoutes);
app.use("/users", usersRoutes);
app.use("/jobs", jobsRoutes);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack); //stack is defined with every error instance. traces from most recent to earlier ones
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    //test this
    error: { message, status },
  });
});

module.exports = app; //object that explicitly exports things from a file
