const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
       firstName: {
       type: String,
       required: true
      },
      lastName: {
        type: String,
        required: true
      },
      email: {
       type: String,
       required: true
      },
    },
    availableTimes: {
      type: [ {
        type: Date,
      }]
    },
    address: {
      nickname: { type: String, required: true },
      suiteNo: { type: String },
      addressLineOne: { type: String, required: true },
      addressLineTwo: { type: String, required: true },
      latitude: { type: String, required: true },
      longitude: { type: String, required: true },
    },
    packageDetails: {
      packageName: {
        type: String,
        required: true,
        trim: true,
      },
      packageOriginalPrice: {
        type: Number,
        required: true,
      },
      packageSalePrice: {
        type: Number,
        required: true,
      },
    },
    totalBookingAmount: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
    },
    status: {
      type: String,
      enum: [
        "payment-pending",
        "payment-active",
        "payment-success",
      ],
      default: "payment-pending",
      required: true,
    },
    statusHistory: [
      {
        status: String,
        changedAt: Date,
        changedBy: {
          type: String,
        },
        message: String,
      },
    ],
  },
  { timestamps: true },
  { typeKey: "$type" }
);

module.exports = Booking = mongoose.model("booking", bookingSchema);
