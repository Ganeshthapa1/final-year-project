const express = require('express');
const {
  getPets,
  getPet,
  createPet,
  updatePet,
  deletePet,
  searchPets
} = require('../controllers/petController');

const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
router.use(authenticateToken);

// Pet routes
router.route('/')
  .get(getPets)
  .post(createPet);

router.route('/search')
  .get(searchPets);

router.route('/:id')
  .get(getPet)
  .put(updatePet)
  .delete(deletePet);

module.exports = router;
