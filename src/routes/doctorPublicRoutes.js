const express = require("express");
const { getAllDoctors } = require("../controllers/doctorController");

const router = express.Router();
router.route("/").get(getAllDoctors);
module.exports = router;
