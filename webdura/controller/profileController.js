const User = require("../model/user");
const {
  statusCode: { BAD_REQUEST, SUCCESS, INTERNAL_SERVER_ERROR, UN_AUTHORIZED },
} = require("../utils");

module.exports = {
  registerUser: async (req, res) => {
    try {
      const { firstName, lastName, email, address, phoneNumber, roles } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(BAD_REQUEST)
          .json({ status: false, message: "User already exists." });
      }
      

      User.create(
        {
          firstName,
          lastName,
          email,
          phoneNumber,
          address,
          roles
        },
        (err, doc) => {
          if (err) {
            if (err.name == "ValidationError") {
              console.log("Error Validating!", err.code);
              
              return res.status(BAD_REQUEST).json({
                status: false,
                message: err.message,
              });
            } else {
              console.error(err);            
            }
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
  },
};
