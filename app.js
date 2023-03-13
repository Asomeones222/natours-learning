const express = require("express");
const morgan = require("morgan");
const tourRouter = require("./routes/tourRoute");
const userRouter = require("./routes/userRoute");

// standard to call it app and so the file
const app = express();

// Invoke the use method to use a Middleware

// We want to use this middleware only if we're in a dev environment so we use the NODE_ENV variable to check if to use it or not.
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
// app.use((req, res, next) => {
// // Validate JSON
//     next();
// });
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
// You can use multiple middleware. Order is crucial

app.use((req, res, next) => {
    // Middleware which adds a property to the req object indicating the time of the request
    req.requestTime = new Date().toISOString();
    next();
});

// Creating a new router resembles creating a new mini-application which is able to respond to requests on its own
// Using a router as a middleware is also called mounting a router
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
