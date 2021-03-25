const jwt = require("jsonwebtoken");
const Assistant = require("../models/assistant");

// note the for authentification we require the user token from the server side
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const assitant = await Assistant.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!assitant) {
      throw new Error();
    }

    req.token = token;
    req.assistant = assitant;

    next();
  } catch (e) {
    res
      .status(401)
      .send({
        message: { msgBody: "Assistant not Authenticated.", msgError: true },
      });
  }
};

module.exports = auth;
