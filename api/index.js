const express = require("express");
const app = express();
const mongoose = require("mongoose");
const https = require("https");
const fs = require("fs");
const path = require("path");

const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");

const router = express.Router();
const dotenv = require("dotenv");

dotenv.config();

const cors = require("cors"); // Import the cors package

app.use(cors());

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

app.listen(8800, () => {
  console.log("Backend server is running!");
});
