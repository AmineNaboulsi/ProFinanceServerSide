const express =  require("express");
const router  = express.Router();
const usercontroller = require("../Controller/usercontroller");

router.post("/adduser" , usercontroller.adduser);
router.post("/auth" , usercontroller.loginuser);



module.exports = router;
