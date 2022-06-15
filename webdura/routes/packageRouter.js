const router = require("express").Router();
const joi = require("joi");

const validate = require("../middleware/validateRequest");
const {
  addPackage,
} = require("../controller/packageController");


// CREATE booking
router.post(
  "/add",
  validate(
    (schema = joi.object({
      packageName: joi.string().min(3).max(100).required(),
      description: joi.string().min(5).max(250).required(),
      isActive: joi.boolean().required(),
      email: joi.string().required(),
      packagePrices: joi.object({
            price: joi.number().required(),
            salePrice: joi.number().required(),
          })
    }))
  ),
  addPackage
);

module.exports = router;
