const express = require("express");
const router = express.Router();
const LicenceController = require("../Controller/LicenceController");
const auth = require("../Middleware/authMiddleware");


router.post("/newkey",LicenceController.newkey);
router.post("/getlks",LicenceController.listLicence);
router.post("/getbyId",LicenceController.LicenceByID);
router.post("/uselicence",LicenceController.UseLicence);
router.post("/lcV",LicenceController.LicenceStillValide);
router.post("/uplk",LicenceController.UpdateLicence);


module.exports = router;