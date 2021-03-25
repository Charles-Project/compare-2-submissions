const express = require("express");
const Assistant = require("../models/assistant");
const auth = require("../middleware/auth");
const router = new express.Router();


// create a single assistant (sign up) recapture//
router.post("/assistant", async (req, res) => {
  const assistant = new Assistant(req.body);

  try {
    await assistant.save();
    res.status(201).send({message:{msgBody:"Assistant Created Successfully", msgError: false}});

  } catch (e) {
    res
      .status(400)
      .send({ message: { msgBody: "Assistant not Created", msgError: true }, e });
  }
});

// ----------------verification route--------------------------------

// login route
router.post("/assistant/login", async (req, res) => {
  try {
      const assistant = await Assistant.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await assistant.generateAuthToken();
    res.send({
        message: { msgBody: "Login successful", msgError: false }, 
        token: token
    })

  } catch (error) {

    res.status(400).send({
      message: {
        msgBody: "Login Failed, Assistant account not Found",
        msgError: true,
      },
      error
    });
  }
});

// log out route
router.post("/assistant/logout", auth, async (req, res) => {
  try {
    req.assistant.tokens = req.assistant.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.assistant.save();
    res.send({ message: { msgBody: "Logout Successful", msgError: false }});
  } catch (e) {
    res
      .status(500)
      .send({  message: { msgBody: " Failed toLogout ", msgError: true } });
  }
});

// logout all assistant
router.post("/assistant/logoutAll", auth, async (req, res) => {
  try {
    req.assistant.tokens = [];
    await req.assistant.save();
    res.send({
      message: {
        msgBody: "Logout multiple login successsfully",
        msgError: "false",
      },
    });
  } catch (e) {
    res
      .status(500)
      .send({ message: { msgBody: "failed to logout", msgError: "true" } });
  }
});

// route to delete an assitant account
router.delete("/assistant/me", auth, async (req, res) => {
  try {
    await req.assistant.remove();
    res.send({ message: "Assistant account deleted" });
  } catch (error) {
    return res.status(500).send({ message: "failed" });
  }
});

module.exports = router;
