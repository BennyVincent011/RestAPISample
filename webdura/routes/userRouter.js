const router = require("express").Router();
const joi = require("joi");

const validate = require("../middleware/validateRequest");
const {
  registerUser,
} = require("../controller/profileController");


// CREATE user
router.post(
  "/register",
  validate(
    (schema = joi.object({
      firstName: joi.string().min(3).max(20).required(),
      lastName: joi.string().min(1).max(20).required(),
      email: joi.string().email().trim(true).required(),
      phoneNumber: joi.string().min(10).max(50).required(),
      address: joi
        .array()
        .items(
          joi.object({
            nickname: joi.string().max(25).required(),
            suiteNo: joi.string().max(25),
            addressLineOne: joi.string().min(3).max(50).required(),
            addressLineTwo: joi.string().min(3).max(50).required(),
            latitude: joi.string().required(),
            longitude: joi.string().required(),
          })
        )
        .min(1)
        .max(5),
       roles: joi.array()
    }))
  ),
  registerUser
);

module.exports = router;
