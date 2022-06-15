require("dotenv").config();
const express = require("express");
const cors = require("cors");


// database connection
require("./config/database").connect();

// creating express app
const app = express();

//importing routers
const  bookingRouter = require("./routes/bookingRouter");
const  userRouter = require("./routes/userRouter");
const  packageRouter = require("./routes/packageRouter");


// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));

app.get("/api/v1/", (req, res) => {
  res.json({ message: "welcome to webudra Server version 1" }).status(200);
});

// service routers
app.use("/api/v1/booking", bookingRouter);
app.use("/api/v1/profile", userRouter);
app.use("/api/v1/package", packageRouter);


module.exports = app;
