const express = require("express");
const registerValidation = require("../../validation/register.validation");
const userModel = require("../../models/Users.model");
const bcrypt = require("../../config/bcrypt");
const token = require("../../config/jwt");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    // req.body
    const validatedValue = await registerValidation(req.body);
    console.log("validatedValue", validatedValue);
    const user = await userModel.findUserByEmail(validatedValue.email);
    if (user) {
      res.status(400).json("email already exist");
    }
    const hashpassword = bcrypt.createHash(validatedValue.password);
    const newUser = await userModel.createUser(
      validatedValue.name,
      validatedValue.email,
      hashpassword,
      validatedValue.isBizz
    );
    res.status(201).json(newUser);
    const userToken = token(validatedValue.email);
    console.log(userToken);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
});

module.exports = router;
