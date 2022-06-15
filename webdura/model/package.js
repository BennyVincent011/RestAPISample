const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    packageName: {
      type: String,
      minlength: 3,
      maxlength: 100,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      minlength: 5,
      maxlength: 250,
      required: true,
    },
    isActive: {
      type: Boolean,
      default:true,
      required:true
    },
    packagePrices: 
      {
        price: {
          type: Number,
          required: true,
        },
        salePrice: {
          type: Number,
          required: true,
        },
      },
  },
  { timestamps: true }
);

module.exports = User = mongoose.model("package", packageSchema);
