<template>
  <AdminLayout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Clients</h1>
        <button
          @click="openCreateModal"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Client
        </button>
      </div>

      <!-- Search and Filter -->
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6"
      >
        <div class="flex flex-wrap gap-4">
          <div class="flex-1 min-w-48">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Search</label
            >
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search clients..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="flex-1 min-w-48">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Sort by</label
            >
            <select
              v-model="sortBy"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
              <option value="last_visit">Last Visit</option>
              <option value="num_pets">Number of Pets</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Clients Table -->
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Client Directory</h2>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
          ></div>
          <span class="ml-2 text-gray-600">Loading clients...</span>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="px-6 py-8">
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div class="flex">
              <svg
                class="w-5 h-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-yellow-800">
                  Backend Connection Issue
                </h3>
                <p class="mt-1 text-sm text-yellow-700">
                  {{ error }}. Please try again later.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Clients table content -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Client
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Contact
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Pets
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Last Visit
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Next Appointment
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="client in paginatedClients"
                :key="client.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="ml-0.2">
                      <div class="text-sm font-medium text-gray-900">
                        {{ client.name }}
                      </div>
                      <div class="text-sm text-gray-500">
                        Client ID: {{ client.id }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ client.email }}</div>
                  <div class="text-sm text-gray-500">
                    {{ client.phone || "N/A" }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="pet in client.pets"
                      :key="pet"
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {{ pet }}
                    </span>
                    <span
                      v-if="!client.pets || client.pets.length === 0"
                      class="text-sm text-gray-500"
                    >
                      No pets
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ client.last_visit }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ client.next_appointment }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      @click="openViewModal(client)"
                      class="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                    <button
                      @click="openEditModal(client)"
                      class="text-green-600 hover:text-green-900"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteClient(client.id)"
                      class="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="!loading && !error"
        class="mt-6 flex items-center justify-between"
      >
        <div class="text-sm text-gray-700">
          Showing {{ paginatedClients.length }} of
          {{ filteredClients.length }} results
        </div>
        <div class="flex space-x-2">
          <button
            :disabled="currentPage === 1"
            @click="currentPage--"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'px-3 py-2 border border-gray-300 rounded-md text-sm',
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-50',
            ]"
          >
            {{ page }}
          </button>
          <button
            :disabled="currentPage === totalPages"
            @click="currentPage++"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <!-- Client Form Modal -->
      <ClientFormModal
        :show="showModal"
        :is-edit="isEdit"
        :is-view="isView"
        :client="selectedClient"
        @create="createClient"
        @update="updateClient"
        @close="closeModal"
      />
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useClientStore } from "@/stores/client";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ClientFormModal from "@/components/ui/ClientFormModal.vue";

const clientStore = useClientStore();

const searchQuery = ref("");
const sortBy = ref("name_asc");
const currentPage = ref(1);
const pageSize = 10;
const showModal = ref(false);
const isEdit = ref(false);
const isView = ref(false);
const selectedClient = ref(null);
const loading = ref(true);
const error = ref(null);

const filteredClients = computed(() => {
  let result = [...clientStore.clients];
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (client) =>
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.phone?.toLowerCase().includes(query)
    );
  }
  if (sortBy.value === "name_asc") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy.value === "name_desc") {
    result.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortBy.value === "last_visit") {
    result.sort(
      (a, b) => new Date(b.last_visit || 0) - new Date(a.last_visit || 0)
    );
  } else if (sortBy.value === "num_pets") {
    result.sort((a, b) => (b.pets?.length || 0) - (a.pets?.length || 0));
  }
  return result;
});

const totalPages = computed(() =>
  Math.ceil(filteredClients.value.length / pageSize)
);

const paginatedClients = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredClients.value.slice(start, start + pageSize);
});

onMounted(async () => {
  loading.value = true;
  const success = await clientStore.fetchClients();
  if (!success) {
    error.value = "Failed to load clients";
  }
  loading.value = false;
});

function openCreateModal() {
  isEdit.value = false;
  isView.value = false;
  selectedClient.value = null;
  showModal.value = true;
}

function openEditModal(client) {
  isEdit.value = true;
  isView.value = false;
  selectedClient.value = client;
  clientStore.fetchClient(client.id); // Refresh client data
  showModal.value = true;
}

function openViewModal(client) {
  isEdit.value = false;
  isView.value = true;
  selectedClient.value = client;
  clientStore.fetchClient(client.id); // Refresh client data
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  isEdit.value = false;
  isView.value = false;
  selectedClient.value = null;
}

async function createClient(data) {
  const success = await clientStore.createClient(data);
  if (!success) {
    alert("Failed to create client");
  }
}

async function updateClient(data) {
  // Data is already updated via clientStore.updateClient
  await clientStore.fetchClients(); // Refresh clients
}

async function deleteClient(id) {
  if (confirm("Are you sure you want to delete this client?")) {
    const success = await clientStore.deleteClient(id);
    if (!success) {
      alert("Failed to delete client");
    }
  }
}
</script>

<style scoped>
/* Unchanged */
</style>
