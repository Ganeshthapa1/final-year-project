import api from './api.js';

export const petService = {
  // Get all pets
  getPets: async (params = {}) => {
    try {
      const response = await api.get('/pets', { params });
      return response;
    } catch (error) {
      console.error('Error fetching pets:', error);
      throw error;
    }
  },

  // Get pet by ID
  getPet: async (id) => {
    try {
      const response = await api.get(`/pets/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching pet:', error);
      throw error;
    }
  },

  // Create new pet
  createPet: async (petData) => {
    try {
      const response = await api.post('/pets', petData);
      return response;
    } catch (error) {
      console.error('Error creating pet:', error);
      throw error;
    }
  },

  // Update pet
  updatePet: async (id, petData) => {
    try {
      const response = await api.put(`/pets/${id}`, petData);
      return response;
    } catch (error) {
      console.error('Error updating pet:', error);
      throw error;
    }
  },

  // Delete pet
  deletePet: async (id) => {
    try {
      const response = await api.delete(`/pets/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting pet:', error);
      throw error;
    }
  },

  // Get pets by species
  getPetsBySpecies: async (species) => {
    try {
      const response = await api.get('/pets', { 
        params: { species } 
      });
      return response;
    } catch (error) {
      console.error('Error fetching pets by species:', error);
      throw error;
    }
  },

  // Get pets by client
  getPetsByClient: async (clientId) => {
    try {
      const response = await api.get('/pets', { 
        params: { client_id: clientId } 
      });
      return response;
    } catch (error) {
      console.error('Error fetching pets by client:', error);
      throw error;
    }
  }
};
