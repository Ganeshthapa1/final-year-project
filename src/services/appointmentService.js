import api from "./api";

export const appointmentService = {
  // Get all appointments
  getAppointments: async (params = {}) => {
    try {
      const response = await api.get("/appointments", { params });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching appointments:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Get appointment by ID
  getAppointment: async (id) => {
    try {
      const response = await api.get(`/appointments/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching appointment:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Create new appointment
  createAppointment: async (appointmentData) => {
    try {
      const response = await api.post("/appointments", appointmentData);
      return response.data;
    } catch (error) {
      console.error(
        "Error creating appointment:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Update appointment
  updateAppointment: async (id, appointmentData) => {
    try {
      const response = await api.put(`/appointments/${id}`, appointmentData);
      return response.data;
    } catch (error) {
      console.error(
        "Error updating appointment:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Delete appointment
  deleteAppointment: async (id) => {
    try {
      const response = await api.delete(`/appointments/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        "Error deleting appointment:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Get today's appointments
  getTodaysAppointments: async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await api.get("/appointments", {
        params: { date: today },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching today's appointments:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Get appointments by status
  getAppointmentsByStatus: async (status) => {
    try {
      const response = await api.get("/appointments", {
        params: { status },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching appointments by status:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Get appointments by doctor
  getAppointmentsByDoctor: async (doctorId) => {
    try {
      const response = await api.get("/appointments", {
        params: { doctor_id: doctorId },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching appointments by doctor:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Book appointment from public form
  bookAppointment: async (form) => {
    try {
      const response = await api.post("/appointments/public", form);
      console.log(`API response status: ${response.status}`);
      return response.data;
    } catch (error) {
      console.error(
        "Error booking appointment:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};
