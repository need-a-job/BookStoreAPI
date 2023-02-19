const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create user schema
const userSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  isBizz: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// create collection
// create object to manipulate the data

const User = mongoose.model("users", userSchema);

// register - finding out if there already is a user with that email

const findUserByEmail = (email) => {
  return User.findOne({ email });
};

const findUserById = (_id) => {
  return User.findOne({ _id });
};

// create user - register
const createUser = (name, email, hashedPassword, isBizz) => {
  const user = new User({
    name,
    email,
    password: hashedPassword,
    isBizz,
  });
  return user.save();
};

module.exports = { findUserByEmail, createUser, findUserById };
