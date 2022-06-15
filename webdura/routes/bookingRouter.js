const router = require("express").Router({mergeParams: true});
const joi = require("joi");

const validate = require("../middleware/validateRequest");
const {
  createBooking,
  updateBookingStatus,
  getBookingByFilter
} = require("../controller/bookingController");


// CREATE booking
router.post(
  "/create",
  validate(
    joi.object({
      availableTimes: joi.array().required(),
      addressId: joi.string().required(),
      packageId: joi.string().required(),
      note: joi.string(),
      email: joi.string().required()
    })
  ),
  createBooking
);

// GET booking by booking by status with pagination
router.get(
  "/filter",
  validate(
    joi.object({
      email: joi.string(),
      offset: joi.number(),
      limit: joi.number(),
      status: joi.string()
    }),
    "query"
  ),
  getBookingByFilter
);

//UPDATE booking status
router.patch(
  "/update",
  validate(
    joi.object({
      email: joi.string(),
      status: joi.string(),
      bookingId: joi.string()
    }),
  ),
  updateBookingStatus
);

module.exports = router;
