const Package = require("../model/package");
const {
  statusCode: { BAD_REQUEST, SUCCESS, INTERNAL_SERVER_ERROR, UN_AUTHORIZED },
} = require("../utils");

module.exports = {
  addPackage: async (req, res) => {
    try {
      const {email, packageName, description, isActive, packagePrices} = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(BAD_REQUEST)
          .json({ status: false, message: "User not found" });
      } else if( !user.roles.find(x=> x==="admin")) {
        return res
          .status(UN_AUTHORIZED)
          .json({ status: false, message: "User have no access" });
      }
      

      Package.create(
        {
          packageName,
          description,
          isActive,
          packagePrices,
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
