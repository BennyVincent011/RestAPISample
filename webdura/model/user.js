const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: [
      {
        nickname: String,
        suiteNo: String,
        addressLineOne: String,
        addressLineTwo: String,
        latitude: String,
        longitude: String,
      },
    ],
    roles: {
      type: [
        {
          type: String,
          enum: ['customer', 'executive', 'admin'],
        },
      ],
      default: 'customer',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = User = mongoose.model("user", userSchema);
