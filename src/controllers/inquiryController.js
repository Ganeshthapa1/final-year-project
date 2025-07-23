const Inquiry = require("../models/Inquiry");
const Joi = require("joi");
const { asyncHandler } = require("../middleware/errorHandler");

const inquirySchema = Joi.object({
  name: Joi.string().required().trim().min(1).max(255),
  email: Joi.string().email().required().trim().max(255),
  subject: Joi.string().required().trim().min(1).max(255),
  message: Joi.string().required().trim().min(1),
});

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private (Admin)
const getAllInquiries = asyncHandler(async (req, res) => {
  const inquiries = await Inquiry.findAll();

  res.status(200).json({
    success: true,
    count: inquiries.length,
    data: inquiries,
  });
});

// @desc    Create new inquiry
// @route   POST /api/inquiries
// @access  Public
const createInquiry = asyncHandler(async (req, res) => {
  const { error, value } = inquirySchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message,
    });
  }

  const inquiry = await Inquiry.create(value);

  res.status(201).json({
    success: true,
    message: "Inquiry submitted successfully.",
    data: inquiry,
  });
});

// @desc    Delete inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private (Admin)
const deleteInquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deleted = await Inquiry.delete(id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      error: "Inquiry not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Inquiry deleted successfully",
  });
});

module.exports = {
  getAllInquiries,
  createInquiry,
  deleteInquiry,
};
