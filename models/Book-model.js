const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const AWS = require("aws-sdk");

// book schema
const bookSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  name: {
    type: String,
    require: true,
    unique: true,
  },
  author: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  sold: {
    type: Number,
    default: 0,
  },
  release_date: {
    type: String,
    require: true,
  },
  children: {
    type: Boolean,
    default: false,
    require: true,
  },
  image: {
    type: String,
  },
});
const Book = mongoose.model("books", bookSchema);

// multer storage to uploads for later to be in aws
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({ storage: storage });

// aws
const s3 = new AWS.S3({
  accessKeyId: process.env.secretKey_AWS,
  secretAccessKey: process.env.secretKey_secretAWS,
});

const createBook = async (data, file) => {
  // Upload the file to S3

  const s3Params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: data.name,
    Body: "image/jpg" ,
    ContentType: "",
  };
  console.log("s3", s3Params);
  console.log("hello");

  const s3Response = await s3.upload(s3Params).promise();
  const coverImageUrl = s3Response.Location;

  // Create a new book object with the uploaded image URL
  const book = new Book({
    userId: data.userId,
    name: data.name,
    author: data.author,
    price: data.price,
    sold: data.sold,
    release_date: data.release_date,
    children: data.children,
    image: coverImageUrl,
  });

  try {
    await book.save();
    return book;
  } catch (error) {
    throw new Error(error);
  }
};
// // initial create of book
// const createBook = async (data, file) => {
//   const book = new Book({
//     userId: data.userId,
//     name: data.name,
//     author: data.author,
//     price: data.price,
//     sold: data.sold,
//     release_data: data.release_date,
//     children: data.children,
//   });

//   if (file) {
//     const s3Params = {
//     Bucket: 'YOUR_BUCKET_NAME',
//     Key: file.originalname,
//     Body: file.buffer,
//     ContentType: file.mimetype,

//     const imagePath = file;
//     const blob = fs.readFileSync(imagePath);
//     await s3
//       .upload({
//         Bucket: process.env.AWS_S3_BUCKET_NAME,
//         Key: data.name,
//         Body: blob,
//       })
//       .promise();
//   }
//   return book.save();
// };

// find all by id
findAllBookById = (userId) => {
  return Book.find({ userId });
};

// find one by id
findBookById = (userId) => {
  return Book.findById({ userId });
};

// find by name
findBookByName = (name) => {
  return Book.findOne({ name });
};

// find book less then date of today
findBooksLessThen = (date) => {
  var date = new Date();
  return Book.find({ $match: { release_date: { $lt: date } } });
};

// find book greater of today
findBooksGreatThen = (date) => {
  var date = new Date();
  return Book.find({ $match: { release_date: { $gte: date } } });
};
module.exports = {
  findAllBookById,
  createBook,
  findBookByName,
  findBooksLessThen,
  findBooksGreatThen,
};
