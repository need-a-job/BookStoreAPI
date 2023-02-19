const express = require("express");
const router = express.Router();

const registerRouter = require("./api/register");
const loginRouter = require("./api/login");
const bookRouter = require("./api/book");
const contactUsRouter = require("./api/contact_us");

router.use("/register", registerRouter);
router.use("/login", loginRouter);
router.use("/book", bookRouter);
router.use("/contactUs", contactUsRouter);

module.exports = router;
