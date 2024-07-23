const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors =  require("cors")
const LKRouter = require("./Router/LicenceRouter")
const userRouter = require("./Router/userRouter")


require("dotenv").config()

mongoose.connect(process.env.mongokey);
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
})
app.use(cors());
app.use(express.json());


app.use("/lk", LKRouter);
app.use("/user", userRouter);




app.listen(3200, () => {
    console.log("Server is running on port 3200");
})