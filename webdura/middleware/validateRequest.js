const {
  validateRequest,
  statusCode: { BAD_REQUEST },
} = require("../utils");

const validate = (schema, property = "body") => {
  return async (req, res, next) => {
    const error = await validateRequest(schema, req[property]);
    if (error) {
      res.status(BAD_REQUEST).json({ status: false, message: error.message });
    } else {
      next();
    }
  };
};

module.exports = validate;
