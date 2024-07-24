const express =  require("express");
const router  = express.Router();
const usercontroller = require("../Controller/usercontroller");

router.post("/adduser" , usercontroller.adduser);
router.post("/auth" , usercontroller.loginuser);
router.post("/valide_usertk" , usercontroller.validate_token);



module.exports = router;
