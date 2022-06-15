const statusCode = require("./statusCode");

module.exports = {
  validateRequest: async (schema, data) => {
    return new Promise((resolve, reject) => {
      const { error } = schema.validate(data);
      resolve(error);
    });
  },
  statusCode,
};
