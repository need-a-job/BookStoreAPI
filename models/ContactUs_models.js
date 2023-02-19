const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContactUsSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  subject: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
});

const ContactUs = mongoose.model("contactUs", ContactUsSchema);

// create ContactUs - contactUS
const createContactUs = (name, email, subject, content) => {
  const contact = new ContactUs({
    name,
    email,
    subject,
    content,
  });
  return contact.save();
};

module.exports = createContactUs;
