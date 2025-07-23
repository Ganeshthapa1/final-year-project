const express = require('express');
const {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  searchClients,
  getClientPets,
  getClientAppointments
} = require('../controllers/clientController');

const router = express.Router();

// Client routes
router.route('/')
  .get(getClients)
  .post(createClient);

router.route('/search')
  .get(searchClients);

router.route('/:id')
  .get(getClient)
  .put(updateClient)
  .delete(deleteClient);

router.route('/:id/pets')
  .get(getClientPets);

router.route('/:id/appointments')
  .get(getClientAppointments);

module.exports = router;
