const { Schema, model, Types } = require("mongoose");

const Token = new Schema({
  user: { type: Types.ObjectId, ref: "User" },
  refreshToken: { type: String, required: true },
});

module.exports = model("Token", Token);
