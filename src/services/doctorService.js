import api from "./api";

export const doctorService = {
  getAll() {
    return api.get("/doctors");
  },
  getAllDoctors() {
    return api.get("/doctor");
  },
  getById(id) {
    return api.get(`/doctors/${id}`);
  },
  getStats() {
    return api.get("/doctors/stats");
  },
  search(query) {
    return api.get(`/doctors/search?q=${encodeURIComponent(query)}`);
  },
  getBySpecialization(specialization) {
    return api.get(`/doctors/specialization/${specialization}`);
  },
  create(data) {
    return api.post("/doctors", data);
  },
  update(id, data) {
    return api.put(`/doctors/${id}`, data);
  },
  delete(id) {
    return api.delete(`/doctors/${id}`);
  },
  getStatuses() {
    return api.get("/doctors/statuses");
  },
};
