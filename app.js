const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const router = require("./routes/index");
const cookieparser = require("cookie-parser");

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieparser());
app.use(express.json());
app.use("/api", router);

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const start = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    app.listen(PORT, () => {
      console.log("Server has been started on:", PORT);
    });
  } catch (e) {
    console.log(e.message);
  }
};

start();
