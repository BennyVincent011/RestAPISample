const mongoose = require("mongoose");
require("dotenv").config();

const { MONGODB_TEST_DATABASE } = process.env;

exports.connect = () => {
  mongoose
    .connect(MONGODB_TEST_DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DATABASE CONNECTED SUCCESSFULLY");
    })
    .catch((e) => {
      console.log("DB CONNECTION FAILED");
      console.log(e);
      process.exit(1);
    });
};
