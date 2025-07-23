const express = require('express');
const {
  getAllInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
  getInventoryStats
} = require('../controllers/inventoryController');

const router = express.Router();

router.route('/')
  .get(getAllInventory)
  .post(createInventory);

router.route('/stats')
  .get(getInventoryStats);

router.route('/:id')
  .get(getInventoryById)
  .put(updateInventory)
  .delete(deleteInventory);

module.exports = router;
