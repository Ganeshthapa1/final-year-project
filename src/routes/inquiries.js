const express = require("express");
const {
  getAllInquiries,
  createInquiry,
  deleteInquiry,
} = require("../controllers/inquiryController");
const router = express.Router();

router.route("/").get(getAllInquiries).post(createInquiry);

router.route("/:id").delete(deleteInquiry);

module.exports = {
  router,
  createInquiry, // Export createInquiry for public POST
};
