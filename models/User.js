const { Schema, model } = require("mongoose");

const User = new Schema({
  phone: { type: String, required: true, unique: true },
  activationCode: { type: String, unique: true },
  role: { type: String, default: "USER" },
});

module.exports = model("User", User);
