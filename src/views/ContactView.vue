<!-- src/views/ContactView.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 animate-fade-in-up">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
        <p class="text-xl text-gray-600">
          Get in touch with us for any questions or concerns about your pet's
          health.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Contact Information -->
        <div class="animate-fade-in-left">
          <div class="bg-white rounded-lg p-8 shadow-lg">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h3>
            <div class="space-y-6">
              <div
                v-for="contact in contactInfo"
                :key="contact.title"
                class="flex items-start"
              >
                <component
                  :is="contact.icon"
                  class="h-6 w-6 text-blue-600 mr-4 mt-1"
                />
                <div>
                  <h4 class="font-semibold text-gray-900">
                    {{ contact.title }}
                  </h4>
                  <div class="text-gray-600" v-html="contact.content"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="animate-fade-in-right">
          <div class="bg-white rounded-lg p-8 shadow-lg">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">
              Send us a Message
            </h3>
            <form @submit.prevent="submitContact" class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Name *</label
                >
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Email *</label
                >
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Subject *</label
                >
                <input
                  v-model="form.subject"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Message subject"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Message *</label
                >
                <textarea
                  v-model="form.message"
                  rows="5"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your message..."
                ></textarea>
              </div>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span
                  v-if="isSubmitting"
                  class="flex items-center justify-center"
                >
                  <div class="spinner mr-2"></div>
                  Sending Message...
                </span>
                <span v-else>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MapPin, Phone, Mail, Clock } from "lucide-vue-next";
import { useUIStore } from "@/stores/ui";
import { useSettingsStore } from "@/stores/settings";
import api from "@/services/api"; // Add api import

export default {
  name: "ContactView",
  components: { MapPin, Phone, Mail, Clock },
  setup() {
    const uiStore = useUIStore();
    const settingsStore = useSettingsStore();
    window.addEventListener("settings-updated", () => {
      settingsStore.address = settingsStore.address;
      settingsStore.district = settingsStore.district;
      settingsStore.phone = settingsStore.phone;
      settingsStore.email = settingsStore.email;
    });
    return { uiStore, settingsStore };
  },
  data() {
    return {
      isSubmitting: false,
      form: {
        name: "",
        email: "",
        subject: "",
        message: "",
      },
      contactInfo: [],
    };
  },
  mounted() {
    this.contactInfo = [
      {
        icon: "MapPin",
        title: "Address",
        get content() {
          return `${this.settingsStore.address}<br>${this.settingsStore.district}`;
        },
        settingsStore: this.settingsStore,
      },
      {
        icon: "Phone",
        title: "Phone",
        get content() {
          return `${this.settingsStore.phone}<br><span class='text-sm text-gray-500'>Emergency: (555) 123-4568</span>`;
        },
        settingsStore: this.settingsStore,
      },
      {
        icon: "Mail",
        title: "Email",
        get content() {
          return this.settingsStore.email;
        },
        settingsStore: this.settingsStore,
      },
      {
        icon: "Clock",
        title: "Hours",
        content: "Sunday - Friday: 10:00 AM - 6:00 PM",
      },
    ];
  },
  methods: {
    async submitContact() {
      this.isSubmitting = true;
      try {
        const response = await api.post("/frontend/inquiries", this.form); // Use api.js
        console.log("Submit inquiry response:", response); // Debug
        if (response.success) {
          this.uiStore.showSuccessMessage(
            "Message Sent!",
            "Thank you for contacting us. We will get back to you within 24 hours."
          );
          this.resetForm();
        } else {
          throw new Error(response.error || "Failed to send message");
        }
      } catch (error) {
        console.error("Error sending message:", error);
        this.uiStore.showSuccessMessage(
          "Error",
          error.message ||
            "There was an error sending your message. Please try again."
        );
      } finally {
        this.isSubmitting = false;
      }
    },

    resetForm() {
      this.form = {
        name: "",
        email: "",
        subject: "",
        message: "",
      };
    },
  },
};
</script>

<style scoped>
.spinner {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
