import { defineStore } from "pinia"

export const useUIStore = defineStore("ui", {
  state: () => ({
    showSuccessModal: false,
    successMessage: {
      title: "",
      message: "",
    },
    isLoading: false,
  }),

  actions: {
    showSuccessMessage(title, message) {
      this.successMessage = { title, message }
      this.showSuccessModal = true
    },

    hideSuccessModal() {
      this.showSuccessModal = false
      this.successMessage = { title: "", message: "" }
    },

    setLoading(status) {
      this.isLoading = status
    },
  },
})
