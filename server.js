const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config({ path: "./config.env" });

const app = require("./app");

const DB = process.env.DATABASE;

mongoose.connect(DB, {}).then(() => {
  console.log("DB connection established successfully");
});

const port = process.env.PORT || 6001;
const server = app.listen(port, () => {
  console.log(`App is running on port ${port} 🚀`);
});
