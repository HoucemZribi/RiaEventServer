const { model, Schema } = require("mongoose");

const adminSchema = new Schema({
  firstName: String,
  lastName: String,
  password: String,
  email: String,
  createdAt: String,
  phone: String,
});

module.exports = model("Admin", adminSchema);
