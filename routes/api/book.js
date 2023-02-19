const express = require("express");
const bookModel = require("../../models/Book-model");
const bookValidation = require("../../validation/book-validation");
const User = require("../../models/Users.model");
const upload = require("../../middleware/multer");

const router = express.Router();

router.post("/book_publish", upload.single("image"), async (req, res) => {
  try {
    // validate
    const validatedValue = await bookValidation(req.body);

    console.log("validatedValue", validatedValue);
    const bookName = await bookModel.findBookByName(validatedValue.name);
    if (bookName) {
      res.status(400).json("name of book already exist");
    } else {
      const newBook = await bookModel.createBook(validatedValue, req.image);
      res.status(201).json(newBook);
    }
    console.log("new book", newBook);
  } catch (err) {
    res.status(500).json({ err });
    console.log(err);
  }
});

router.get("/date", (req, res) => {
  var datetime = new Date();
  bookModel.findBooksLessThen(datetime, (err, items) => {
    if (err) {
      res.status(500).send({ data: err });
    } else {
      res.status(200).send({ data: items });
    }
  });
});

module.exports = router;
