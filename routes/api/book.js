const express = require("express");
const bookModel = require("../../models/Book-model");
const bookValidation = require("../../validation/book-validation");
const User = require("../../models/Users.model");
const upload = require("../../middleware/multer");
const AWS = require('aws-sdk');
const bookUpdateValidation = require("../../validation/book-update-validation")

const router = express.Router();

router.post("/book_publish", upload.single("image"), async (req, res) => {
  try {
    // validate
    console.log(req.headers)
    const validatedValue = await bookValidation(req.body);

    const file = req.file

    if (file == null) {
      console.log('image not found in req');
      return res.status(400).json({ "message": "please choose the file" })
    }

    const s3 = new AWS.S3({
      accessKeyId: process.env.secretKey_AWS,
      secretAccessKey: process.env.secretKey_secretAWS,
      region: process.env.AWS_REGION
    });

    const uploadImage = (file) => {
      const fileStream = fs.createReadStream(file.path);

      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: file.originalname,
        Body: fileStream,
      };

      s3.upload(params, function (err, data) {
        console.log(data)
        if (err) {
          throw err
        }
        console.log(`File uploaded successfully. ${data.Location}`);
      });

      uploadImage(file);
      return res.send(201)
    }

    console.log("validatedValue", validatedValue);
    const bookName = await bookModel.findBookByName(validatedValue.name);
    if (bookName) {
      return res.status(400).json({ "message": "book already exists" });
    }

    const newBook = await bookModel.createBook(validatedValue, req.image);

    if (newBook == null) {
      console.log("hello")
      return res.status(400).json({ "message": "error creating book" })
    }

    return res.status(201).json(newBook);

    console.log("new book", newBook);
  } catch (err) {
    res.status(500).json({ err: err.message });
    console.log(err);
  }
});

// get all books 
router.get('/all-books', async (req, res) => {
  try {
    const books = await bookModel.findAllBook()
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: err.message });
  }
});

// get specific book
router.get('/user-books', async (req, res) => {
  try {
    const specificUser = await bookModel.findAllBookById(req.query.userId)
    console.log("user", req.query)
    if (!specificUser || specificUser.length === 0) {
      res.json({ message: "no userID found" })
    } else
      res.json({ message: specificUser })
    res.status(200)
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
})

router.get('/book', async (req, res) => {
  try {
    const specificUser = await bookModel.findBookById(req.query._id)
    if (!specificUser || specificUser.length === 0) {
      res.status(200).json({ message: "no specific book was found" })
    } else
      res.status(200).json({ message: specificUser })
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
})

router.patch('/book', async (req, res) => {
  try {
    const validatedValue = await bookUpdateValidation(req.body)
    const book = await bookModel.updateBook(validatedValue._id, validatedValue)
    res.status(200).json({ book })
  } catch (err) {
    res.status(500).json({ err: err.message })
    console.log(err)
  }
})

router.delete('/book/', async (req, res) => {
  try {
    const book = bookModel.deleteBook(req.query._id)
    res.status(200).send(`${book.name} has been deleted`)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }

})


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
