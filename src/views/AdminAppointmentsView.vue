<template>
  <AdminLayout>
    <div class="min-h-screen bg-gray-50 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">
                Appointment Management
              </h1>
              <p class="text-gray-600 mt-2">
                View and manage all booked appointments
              </p>
            </div>
            <div class="flex items-center space-x-4">
              <div class="bg-white px-4 py-2 rounded-lg shadow">
                <span class="text-sm text-gray-500">Total Appointments</span>
                <div class="text-2xl font-bold text-blue-600">
                  {{ appointmentStore.appointments.length }}
                </div>
              </div>
              <button
                @click="clearAllAppointments"
                v-if="appointmentStore.appointments.length > 0"
                class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        <!-- Appointments List -->
        <div
          v-if="appointmentStore.appointments.length === 0"
          class="text-center py-12"
        >
          <Calendar class="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            No Appointments Yet
          </h3>
          <p class="text-gray-600 mb-6">
            When customers book appointments, they will appear here.
          </p>
        </div>

        <div v-else class="space-y-6">
          <!-- Filters -->
          <div class="bg-white p-4 rounded-lg shadow">
            <div class="flex flex-wrap gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Filter by Status</label
                >
                <select
                  v-model="statusFilter"
                  class="border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no-show">No Show</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Filter by Date</label
                >
                <input
                  type="date"
                  v-model="dateFilter"
                  class="border border-gray-300 rounded-lg px-3 py-2 w-full"
                />
              </div>
              <div class="flex items-center">
                <button
                  @click="applyFilters"
                  class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          <!-- Appointments Table -->
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Customer Name
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Pet Name
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Doctor Name
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date & Time
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="appointment in filteredAppointments"
                  :key="appointment.id"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ appointment.client_name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ appointment.pet_name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ appointment.doctor_name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{
                      formatDateTime(
                        appointment.appointment_date,
                        appointment.appointment_time
                      )
                    }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm"
                    :class="{
                      'text-yellow-600': appointment.status === 'scheduled',
                      'text-green-600': appointment.status === 'completed',
                      'text-red-600': appointment.status === 'cancelled',
                      'text-orange-600': appointment.status === 'no-show',
                    }"
                  >
                    {{
                      appointment.status.charAt(0).toUpperCase() +
                      appointment.status.slice(1)
                    }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-right space-x-2"
                  >
                    <button
                      @click="editAppointment(appointment)"
                      class="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteAppointment(appointment.id)"
                      class="text-red-600 hover:text-red-800 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Appointment Form Modal -->
        <AppointmentFormModal
          v-if="showModal"
          :show="showModal"
          :isEdit="isEdit"
          :appointment="selectedAppointment"
          @close="closeModal"
          @create="createAppointment"
          @update="updateAppointment"
        />
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAppointmentStore } from "@/stores/appointment";
import Calendar from "@/components/Calendar.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import AppointmentFormModal from "@/components/ui/AppointmentFormModal.vue";

const appointmentStore = useAppointmentStore();
const statusFilter = ref("");
const dateFilter = ref("");
const showModal = ref(false);
const isEdit = ref(false);
const selectedAppointment = ref(null);

const filteredAppointments = computed(() => {
  return appointmentStore.appointments.filter((appointment) => {
    const matchesStatus = statusFilter.value
      ? appointment.status === statusFilter.value
      : true;
    const matchesDate = dateFilter.value
      ? appointment.appointment_date === dateFilter.value
      : true;
    return matchesStatus && matchesDate;
  });
});

function formatDateTime(date, time) {
  if (!date || date === "Invalid Date") return "Invalid Date";
  try {
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString();
    const formattedTime = time || "No time";
    return `${formattedDate} ${formattedTime}`;
  } catch (error) {
    return "Invalid Date";
  }
}

async function updateStatus(appointmentId, newStatus) {
  const success = await appointmentStore.updateAppointmentInBackend(
    appointmentId,
    {
      status: newStatus,
    }
  );
  if (!success) {
    alert("Failed to update appointment status");
  }
}

function clearAllAppointments() {
  appointmentStore.clearAllAppointments();
}

function editAppointment(appointment) {
  isEdit.value = true;
  selectedAppointment.value = { ...appointment }; // Deep copy to avoid mutating
  showModal.value = true;
}

async function createAppointment(data) {
  const success = await appointmentStore.createAppointmentInBackend(data);
  if (success) {
    showModal.value = false;
  } else {
    alert("Failed to create appointment");
  }
}

async function updateAppointment(data) {
  const success = await appointmentStore.updateAppointmentInBackend(
    selectedAppointment.value.id,
    data
  );
  if (success) {
    showModal.value = false;
    selectedAppointment.value = null;
  } else {
    alert("Failed to update appointment");
  }
}

async function deleteAppointment(appointmentId) {
  if (confirm("Are you sure you want to delete this appointment?")) {
    const success = await appointmentStore.deleteAppointmentInBackend(
      appointmentId
    );
    if (!success) {
      alert("Failed to delete appointment");
    }
  }
}

function applyFilters() {
  // Filters are reactive
}

function closeModal() {
  showModal.value = false;
  selectedAppointment.value = null;
  isEdit.value = false;
}

onMounted(() => {
  appointmentStore.fetchAppointments();
});
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
