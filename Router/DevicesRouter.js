const express =  require("express");
const router  = express.Router();
const Devicecontroller = require("../Controller/DevicesController");
const authMiddleware = require("../middleware/authMiddleware"); // Adjust path as needed

router.post("/addmachine" ,authMiddleware, Devicecontroller.AddDevice);
router.post("/getdevices" ,authMiddleware, Devicecontroller.GetDevice);



module.exports = router;
