const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors =  require("cors")
const LKRouter = require("./Router/LicenceRouter")
const userRouter = require("./Router/userRouter")
const deviceRouter = require("./Router/DevicesRouter")
const { CronJob } = require('cron');
const cron = require('node-cron');

require("dotenv").config()

mongoose.connect(process.env.mongokey);
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
})
app.use(cors());
app.use(express.json());
app.disable('x-powered-by');

app.use("/lk", LKRouter);
app.use("/user", userRouter);
app.use("/device", deviceRouter);




app.listen(process.env.PORT, () => {
    console.log("Server is running");
})

/*
const SERVER_URL = process.env.SERVER_URL;
try{
  cron.schedule('*//*50 * * * * *', () => {
    console.log('running a task every minute');
  },{scheduled : true});
}catch(ex){
  console.log('Crash on cron : ',ex)
}
  */
