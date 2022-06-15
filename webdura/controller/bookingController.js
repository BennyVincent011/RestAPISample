const {
  statusCode: { BAD_REQUEST, SUCCESS, INTERNAL_SERVER_ERROR, UN_AUTHORIZED },
} = require("../utils");

const Package = require("../model/package");
const User = require("../model/user");
const Booking = require("../model/booking");
const moment = require("moment-timezone");

module.exports = {
  createBooking: async (req, res) => {
    try {
      const {
        addressId,
        packageId,
        availableTimes,
        note,
        email
      } = req.body;
      
      const userData = await User.findOne({ email });
      if (!userData) {
        return res
          .status(BAD_REQUEST)
          .json({ status: false, message: "User not found" });
      }
      const addressData = await userData.address.find((x) => x._id == addressId);
      if( !addressData) {
        return res
          .status(BAD_REQUEST)
          .json({ status: false, message: "Address error" });
      }

      const bookingId = `Webdura-${moment().format("YYYYMMDD-hhmmSSSS")}`;
      const packageData = await Package.findOne({ _id: packageId });
      if (!packageData) {
        return res
          .status(BAD_REQUEST)
          .json({ status: false, message: "package not found" });
      }
      const { firstName, lastName} = userData;
      const newBooking = {
        bookingId,
        availableTimes,
        customer: {
          firstName,
          lastName,
          email
        },
        address: {
          nickname: addressData.nickname,
          suiteNo: addressData.suiteNo,
          addressLineOne: addressData.addressLineOne,
          addressLineTwo: addressData.addressLineTwo,
          addressLineThree: addressData.addressLineThree,
          latitude: addressData.latitude,
          longitude: addressData.longitude,
        },
        packageDetails: {
          packageName: packageData.packageName,
          packageOriginalPrice: packageData.packagePrices.price,
          packageSalePrice: packageData.packagePrices.salePrice,
        },
        totalBookingAmount: packageData.packagePrices.salePrice,
        status: "payment-pending",
        note: note,
      };
      Booking.create(newBooking, (err, booking) => {
        if (err) {
          if (err.name == "ValidationError") {
            console.error("Error Validating!", err);
            return res.status(BAD_REQUEST).json({
              status: false,
              message: err.message,
            });
          } else {
            console.error(err);
            return res
              .status(500)
              .json({ status: false, message: err.message });
          }
        }
        res.status(SUCCESS).json({
          status: true,
          bookingId,
        });
      });
    } catch (error) {
      console.log(error);
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: false, message: error.message });
    }
  },

  getBookingByFilter: async (req, res) => {
    try {
      var { offset, limit, status, email } = req.query;
      offset = offset ? Number(offset) : 0;
      limit = limit ? Number(limit): 10;
      const skip = (offset-1) * limit; // assuming pageNo starts from 1
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(BAD_REQUEST)
          .json({ status: false, message: "User not found" });
      }
      const {firstName, lastName} = user;
      let bookingQuery = {customer: { firstName, lastName, email}}
      if(status) bookingQuery = {...bookingQuery, status}
      const count = await Booking.countDocuments(bookingQuery);
      Booking.find(bookingQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .then((doc) => {
          return res.status(SUCCESS).json({ status: true, Total:count, items: doc.length, data: doc });
        });
    } catch (error) {
      console.log(error);
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: false, message: error.message });
    }
  },
  updateBookingStatus: async (req, res) => {
    try {
      const { bookingId, email, status } = req.body;
      const user = await User.findOne({ email });
      console.log("bookingId", bookingId);
      const booking = await Booking.findOne({ bookingId: bookingId });

      if (!user) {
        return res
          .status(BAD_REQUEST)
          .json({ status: false, message: "User not found" });
      } else if( !user.roles.find(x=> x==="admin")) {
        return res
          .status(UN_AUTHORIZED)
          .json({ status: false, message: "User have no access to update the status" });
      }

      if (!booking) {
        return res.status(BAD_REQUEST).json({
          status: false,
          message: `No Booking found`,
        });
      }
      const statusHistory=  {
          status: booking.status,
          changedAt: new Date().getTime(),
          changedBy: email
      };

      Booking.findOneAndUpdate(
        { bookingId: bookingId },
        {
          $set: {
            status,
            statusHistory
          },
        },
        { returnDocument: "after" },
        (err, doc) => {
          if (err) {
            return res
              .status(INTERNAL_SERVER_ERROR)
              .json({ status: true, message: "Can't edit service" });
          }
          res.status(SUCCESS).json({ status: true, data: doc });
        }
      );
    } catch (error) {
      console.log(error);
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: false, message: error.message });
    }
  }
};
