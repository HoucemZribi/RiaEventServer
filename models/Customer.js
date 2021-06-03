const { model, Schema } = require("mongoose");

const customerSchema = new Schema({
  firstName: String,
  lastName: String,
  password: String,
  email: String,
  createdAt: String,
  phone: String,
});

module.exports = model("Customer", customerSchema);
