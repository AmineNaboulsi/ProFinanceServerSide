const express =  require("express");
const router  = express.Router();
const Devicecontroller = require("../Controller/DevicesController");
const auth = require("../Middleware/authMiddleware");

router.post("/addmachine" ,auth, Devicecontroller.AddDevice);
router.post("/getdevices" ,auth, Devicecontroller.GetDevice);
router.post("/getdevicesbyc" ,auth, Devicecontroller.GetDeviceByClient);



module.exports = router;
