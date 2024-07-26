const express = require("express");
const router = express.Router();
const LicenceController = require("../Controller/LicenceController");


router.post("/newkey",LicenceController.newkey);
router.post("/getlks",LicenceController.listLicence);
router.post("/getbyId",LicenceController.LicenceByID);
router.post("/uselicence",LicenceController.UseLicence);

module.exports = router;