const { model, Schema } = require("mongoose");

const guestSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  reference: String,
  createdAt: String,
  customer: {
    type: Schema.Types.ObjectId,
    ref: "customers",
  },
});

module.exports = model("Guest", guestSchema);
