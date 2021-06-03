const { model, Schema } = require("mongoose");

const eventSchema = new Schema({
  title: String,
  description: String,
  plan: String,
  startDate: String,
  endDate: String,
  location: String,
  createdAt: String,
  reference: String,

  customer: {
    type: Schema.Types.ObjectId,
    ref: "customers",
  },
});

module.exports = model("Event", eventSchema);
