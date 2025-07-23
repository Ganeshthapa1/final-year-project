import { defineStore } from "pinia";
import api from "@/services/api";

export const useClientStore = defineStore("client", {
  state: () => ({
    clients: [],
  }),
  getters: {
    getClientById: (state) => (id) =>
      state.clients.find((client) => client.id === id),
  },
  actions: {
    async fetchClients() {
      try {
        const response = await api.get("/clients");
        if (response.success) {
          this.clients = response.data;
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error fetching clients:", error);
        return false;
      }
    },
    async fetchClient(id) {
      try {
        const response = await api.get(`/clients/${id}`);
        if (response.success) {
          const index = this.clients.findIndex((client) => client.id === id);
          if (index !== -1) {
            this.clients[index] = response.data;
          } else {
            this.clients.push(response.data);
          }
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error fetching client:", error);
        return false;
      }
    },
    async createClient(data) {
      try {
        const response = await api.post("/clients", data);
        if (response.success) {
          this.clients.push(response.data);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error creating client:", error);
        return false;
      }
    },
    async updateClient(id, data) {
      try {
        const response = await api.put(`/clients/${id}`, data);
        if (response.success) {
          const index = this.clients.findIndex((client) => client.id === id);
          if (index !== -1) {
            this.clients[index] = { ...this.clients[index], ...response.data };
          }
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error updating client:", error);
        return false;
      }
    },
    async deleteClient(id) {
      try {
        const response = await api.delete(`/clients/${id}`);
        if (response.success) {
          this.clients = this.clients.filter((client) => client.id !== id);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error deleting client:", error);
        return false;
      }
    },
  },
});
