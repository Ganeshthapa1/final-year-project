<!-- src/views/InquiriesView.vue -->
<template>
  <AdminLayout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Inquiries</h1>
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-500"
            >Total: {{ inquiries.length }}</span
          >
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
        ></div>
        <span class="ml-2 text-gray-600">Loading inquiries...</span>
      </div>

      <!-- Error state -->
      <div
        v-else-if="error"
        class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
      >
        <div class="flex">
          <svg
            class="w-5 h-5 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              Unable to load inquiries
            </h3>
            <p class="mt-1 text-sm text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Inquiries table -->
      <div v-else class="bg-white shadow-sm rounded-lg overflow-hidden">
        <div v-if="inquiries.length === 0" class="text-center py-12">
          <MessageCircle class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">
            No inquiries yet
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            When customers submit inquiries, they will appear here.
          </p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name & Email
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Subject
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Message
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="inquiry in inquiries"
                :key="inquiry.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ inquiry.name }}
                  </div>
                  <div class="text-sm text-gray-500">{{ inquiry.email }}</div>
                </td>
                <td class="px-6 py-4">
                  <div
                    class="text-sm text-gray-900 max-w-xs truncate"
                    :title="inquiry.subject"
                  >
                    {{ inquiry.subject }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div
                    class="text-sm text-gray-900 max-w-md truncate"
                    :title="inquiry.message"
                  >
                    {{ inquiry.message }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(inquiry.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="viewInquiry(inquiry)"
                    class="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    View
                  </button>
                  <button
                    @click="deleteInquiry(inquiry.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- View Inquiry Modal -->
      <div
        v-if="selectedInquiry"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
        @click="closeModal"
      >
        <div
          class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white"
          @click.stop
        >
          <div class="mt-3">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900">Inquiry Details</h3>
              <button
                @click="closeModal"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Name</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {{ selectedInquiry.name }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Email</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {{ selectedInquiry.email }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Subject</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {{ selectedInquiry.subject }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Message</label
                >
                <p class="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                  {{ selectedInquiry.message }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Date Submitted</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {{ formatDate(selectedInquiry.created_at) }}
                </p>
              </div>
            </div>

            <div class="mt-6 flex justify-end space-x-3">
              <button
                @click="closeModal"
                class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
              <a
                :href="`https://mail.google.com/mail/?view=cm&fs=1&to=${
                  selectedInquiry.email
                }&su=Re:%20${encodeURIComponent(selectedInquiry.subject)}`"
                target="_blank"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Reply via Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script>
import AdminLayout from "@/components/layout/AdminLayout.vue";
import { MessageCircle } from "lucide-vue-next";
import { useUIStore } from "@/stores/ui";
import api from "@/services/api"; // Add api import

export default {
  name: "InquiriesView",
  components: {
    AdminLayout,
    MessageCircle,
  },
  setup() {
    const uiStore = useUIStore();
    return { uiStore };
  },
  data() {
    return {
      inquiries: [],
      loading: true,
      error: null,
      selectedInquiry: null,
    };
  },
  async mounted() {
    await this.fetchInquiries();
  },
  methods: {
    async fetchInquiries() {
      try {
        this.loading = true;
        const response = await api.get("/inquiries"); // Use api.js
        console.log("Inquiries response:", response); // Debug
        if (response.success) {
          this.inquiries = response.data;
        } else {
          throw new Error(response.message || "Failed to fetch inquiries");
        }
      } catch (error) {
        console.error("Error fetching inquiries:", error);
        this.error = error.message || "Failed to load inquiries";
      } finally {
        this.loading = false;
      }
    },

    viewInquiry(inquiry) {
      this.selectedInquiry = inquiry;
    },

    closeModal() {
      this.selectedInquiry = null;
    },

    async deleteInquiry(inquiryId) {
      if (confirm("Are you sure you want to delete this inquiry?")) {
        try {
          const response = await api.delete(`/inquiries/${inquiryId}`); // Use api.js
          console.log("Delete inquiry response:", response); // Debug
          if (response.success) {
            this.inquiries = this.inquiries.filter(
              (inquiry) => inquiry.id !== inquiryId
            );
            this.uiStore.showSuccessMessage(
              "Success",
              "Inquiry deleted successfully"
            );
          } else {
            throw new Error(response.message || "Failed to delete inquiry");
          }
        } catch (error) {
          console.error("Error deleting inquiry:", error);
          this.uiStore.showSuccessMessage("Error", "Failed to delete inquiry");
        }
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    },
  },
};
</script>

<style scoped>
/* Existing styles unchanged */
</style>
