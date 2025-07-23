import api from './api';

export const inventoryService = {
  getAll() {
    return api.get('/inventory');
  },
  getById(id) {
    return api.get(`/inventory/${id}`);
  },
  getStats() {
    return api.get('/inventory/stats');
  },
  create(data) {
    return api.post('/inventory', data);
  },
  update(id, data) {
    return api.put(`/inventory/${id}`, data);
  },
  delete(id) {
    return api.delete(`/inventory/${id}`);
  }
};
