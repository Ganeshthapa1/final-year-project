import { defineStore } from "pinia";
import axios from "axios";

export const usePetStore = defineStore("pet", {
  state: () => ({
    pets: [],
  }),
  actions: {
    async fetchPets() {
      try {
        const token = localStorage.getItem("auth_token");
        const response = await axios.get("/api/pets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.pets = response.data.data;
        return true;
      } catch (error) {
        console.error("Failed to fetch pets:", error);
        return false;
      }
    },
  },
});
