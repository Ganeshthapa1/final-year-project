const Inventory = require('../models/Inventory');
const { asyncHandler } = require('../middleware/errorHandler');

// Get all inventory items
const getAllInventory = asyncHandler(async (req, res) => {
  const items = await Inventory.findAll();
  res.json({ success: true, data: items });
});

// Get single inventory item
const getInventoryById = asyncHandler(async (req, res) => {
  const item = await Inventory.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
  res.json({ success: true, data: item });
});

// Create new inventory item
const createInventory = asyncHandler(async (req, res) => {
  const result = await Inventory.create(req.body);
  res.status(201).json({ success: true, id: result.id });
});

// Update inventory item
const updateInventory = asyncHandler(async (req, res) => {
  await Inventory.update(req.params.id, req.body);
  res.json({ success: true });
});

// Delete inventory item
const deleteInventory = asyncHandler(async (req, res) => {
  await Inventory.delete(req.params.id);
  res.json({ success: true });
});

// Get inventory stats
const getInventoryStats = asyncHandler(async (req, res) => {
  const stats = await Inventory.getStats();
  res.json({ success: true, data: stats });
});

module.exports = {
  getAllInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
  getInventoryStats
};
