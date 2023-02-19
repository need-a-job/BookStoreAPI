const express = require("express");
const contactModel = require("../../models/ContactUs_models");
const contactUsValidation = require("../../validation/contact_us_validation");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const validatedValue = await contactUsValidation(req.body);
    const newContactUs = await contactModel(
      validatedValue.name,
      validatedValue.email,
      validatedValue.subject,
      validatedValue.content
    );
    res.status(201).json(newContactUs);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
});

module.exports = router;
