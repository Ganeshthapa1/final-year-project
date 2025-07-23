import { defineStore } from "pinia";
import { appointmentService } from "@/services/appointmentService";
export const useAppointmentStore = defineStore("appointment", {
  state: () => ({
    appointments: [],
    currentAppointment: {
      ownerName: "",
      phone: "",
      email: "",
      petName: "",
      petType: "",
      date: "",
      time: "",
      service: "",
      notes: "",
    },
  }),

  actions: {
    addAppointment(appointment) {
      const newAppointment = {
        id: Date.now(),
        ...appointment,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      this.appointments.push(newAppointment);
      return newAppointment;
    },

    async updateAppointmentInBackend(id, data) {
      try {
        const response = await appointmentService.updateAppointment(id, data);
        const index = this.appointments.findIndex((appt) => appt.id === id);
        if (index !== -1) {
          this.appointments[index] = response.data;
        }
        return true;
      } catch (error) {
        console.error("Error updating appointment:", error);
        return false;
      }
    },

    async deleteAppointmentInBackend(id) {
      try {
        await appointmentService.deleteAppointment(id);
        this.appointments = this.appointments.filter((appt) => appt.id !== id);
        return true;
      } catch (error) {
        console.error("Error deleting appointment:", error);
        return false;
      }
    },

    clearAllAppointments() {
      this.appointments = [];
    },

    resetCurrentAppointment() {
      this.currentAppointment = {
        ownerName: "",
        phone: "",
        email: "",
        petName: "",
        petType: "",
        date: "",
        time: "",
        service: "",
        notes: "",
      };
    },

    async fetchAppointments() {
      try {
        const response = await import("@/services/appointmentService").then(
          (m) => m.appointmentService.getAppointments()
        );
        // If response is wrapped in { data: [...] }
        this.appointments = response.data || response;
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    },
  },

  getters: {
    getAppointmentById: (state) => (id) => {
      return state.appointments.find((apt) => apt.id === id);
    },

    getAppointmentsByStatus: (state) => (status) => {
      return state.appointments.filter((apt) => apt.status === status);
    },

    getTodaysAppointments: (state) => {
      const today = new Date().toISOString().split("T")[0];
      return state.appointments.filter((apt) => apt.date === today);
    },
  },
});
