const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (authorization) {
      const token = authorization.slice(7, authorization.length);
      // console.log("token", token);
      jwt.verify(token, process.env.secret, (err, decode) => {
        if (err) {
          console.log(err);
          res.status(401).send({ success: false, message: "Invalid Token" });
        } else {
          req.user = decode;
          next();
        }
      });
    } else {
      res.status(401).send({ success: false, message: "No Token" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Something went wrong", error: error });
  }
};
module.exports = auth;
