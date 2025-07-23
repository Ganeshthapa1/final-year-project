import { defineStore } from "pinia";
import axios from "axios";

export const useDoctorStore = defineStore("doctor", {
  state: () => ({
    doctors: [],
  }),
  actions: {
    async fetchDoctors() {
      try {
        const response = await axios.get("/api/doctor");
        this.doctors = response.data.data;
        return true;
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
        return false;
      }
    },
  },
});
