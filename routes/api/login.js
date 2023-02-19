const express = require("express");
const userModel = require("../../models/Users.model");
const token = require("../../config/jwt");
const loginValidation = require("../../validation/login.validation");
const bcrpt = require("../../config/bcrypt");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const validatedValue = await loginValidation(req.body);
    // check email
    const user = await userModel.findUserByEmail(validatedValue.email);
    console.log(user);
    if (!user) {
      res.status(400).text("not a registered email");
      return;
    }
    console.log(user.password);
    // decode password
    const decodepassword = bcrpt.compareHash(req.body.password, user.password);
    // check password
    if (!decodepassword) {
      res.status(400).json("incorrect password");
      return;
    } else {
      // token if correct
      const userToken = token(validatedValue.email);
      console.log(userToken);
    }

    res.status(201).json({ user, decodepassword });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
