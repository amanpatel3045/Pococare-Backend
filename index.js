const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

try {
  mongoose.connect(
    "mongodb+srv://amanpatel3045:amanpatel3045@cluster0.mrvwy83.mongodb.net/?retryWrites=true&w=majority"
  );
  console.log("Db Connected");
} catch (error) {}
const user_routes = require("./routes/userRoute");

app.use("/api", user_routes);

app.listen(3000, function () {
  console.log("Server is running");
});
