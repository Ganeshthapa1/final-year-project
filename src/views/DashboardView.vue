<script>
import AdminLayout from "@/components/layout/AdminLayout.vue";
import DashboardCard from "@/components/layout/DashboardCard.vue";
import {
  Calendar,
  User,
  ShoppingCart,
  Package,
  Stethoscope,
} from "lucide-vue-next";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  name: "DashboardView",
  components: {
    AdminLayout,
    DashboardCard,
    Calendar,
    User,
    ShoppingCart,
    Package,
    Stethoscope,
    Bar,
  },
  data() {
    return {
      dashboardStats: {
        total_pets: 0,
        total_clients: 0,
        total_appointments: 0,
        todays_appointments: 0,
        total_doctors: 0,
      },
      appointmentsByDoctor: [],
      appointmentsByStatus: [],
      pendingAppointments: [],
      summaryFilter: "status",
      loading: true,
      error: null,
    };
  },
  async mounted() {
    await this.fetchDashboardData();
  },
  methods: {
    async fetchDashboardData() {
      try {
        this.loading = true;
        const token = localStorage.getItem("auth_token");
        if (!token) {
          this.$router.push("/login");
          throw new Error("No authentication token found");
        }

        const response = await fetch(
          `http://localhost:8000/api/dashboard/overview?filter=${
            this.summaryFilter
          }&_=${Date.now()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            this.$router.push("/login");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.success) {
          this.dashboardStats = result.data.statistics;
          this.appointmentsByDoctor = result.data.appointments_by_doctor || [];
          this.appointmentsByStatus = result.data.appointments_by_status || [];
          this.pendingAppointments = result.data.pending_appointments || [];
        } else {
          throw new Error(result.message || "Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    handleSummaryFilter(event) {
      this.summaryFilter = event.target.value;
      this.fetchDashboardData();
    },
    addNewProduct() {
      this.$router.push("/products/new").catch(() => {
        alert("Product creation page not implemented yet.");
      });
    },
    viewPendingAppointment(appointmentId) {
      this.$router.push(`/appointments/${appointmentId}`);
    },
  },
};
</script>

<template>
  <AdminLayout>
    <div class="p-6">
      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
        ></div>
        <span class="ml-2 text-gray-600">Loading dashboard...</span>
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
              Unable to load dashboard data
            </h3>
            <p class="mt-1 text-sm text-red-700">{{ error }}</p>
            <button
              @click="fetchDashboardData"
              class="mt-2 text-sm text-blue-600 hover:underline"
            >
              Retry
            </button>
          </div>
        </div>
      </div>

      <!-- Dashboard content -->
      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <DashboardCard
            title="Total Pets"
            :mainValue="dashboardStats.total_pets.toString()"
            :change="0"
          >
            <template #icon>
              <Calendar class="w-6 h-6" />
            </template>
          </DashboardCard>
          <DashboardCard
            title="Clients"
            :mainValue="dashboardStats.total_clients.toString()"
            :change="0"
          >
            <template #icon>
              <User class="w-6 h-6" />
            </template>
          </DashboardCard>
          <DashboardCard
            title="All Appointments"
            :mainValue="dashboardStats.total_appointments.toString()"
            :change="0"
          >
            <template #icon>
              <Package class="w-6 h-6" />
            </template>
          </DashboardCard>
          <DashboardCard
            title="Today's Appointments"
            :mainValue="dashboardStats.todays_appointments.toString()"
            :change="0"
          >
            <template #icon>
              <ShoppingCart class="w-6 h-6" />
            </template>
          </DashboardCard>
          <DashboardCard
            title="Total Doctors"
            :mainValue="dashboardStats.total_doctors.toString()"
            :change="0"
          >
            <template #icon>
              <Stethoscope class="w-6 h-6" />
            </template>
          </DashboardCard>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div class="bg-white rounded-lg p-4 shadow col-span-2">
            <h3 class="text-sm font-semibold mb-4">Appointments by Doctor</h3>
            <div class="h-64">
              <Bar
                :data="{
                  labels: appointmentsByDoctor.map((item) => item.doctor_name),
                  datasets: [
                    {
                      label: 'Appointments',
                      data: appointmentsByDoctor.map(
                        (item) => item.appointment_count
                      ),
                      backgroundColor: [
                        '#3b82f6',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444',
                        '#8b5cf6',
                      ],
                      borderColor: [
                        '#1e3a8a',
                        '#065f46',
                        '#b45309',
                        '#991b1b',
                        '#5b21b6',
                      ],
                      borderWidth: 1,
                    },
                  ],
                }"
                :options="{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: 'Number of Appointments' },
                    },
                    x: { title: { display: true, text: 'Doctor' } },
                  },
                  plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true },
                  },
                }"
              />
            </div>
          </div>
          <div class="bg-white rounded-lg p-4 shadow">
            <h3 class="text-sm font-semibold mb-4">Pending Appointments</h3>
            <div v-if="pendingAppointments.length === 0" class="text-gray-500">
              No pending appointments
            </div>
            <ul v-else class="space-y-2">
              <li
                v-for="appt in pendingAppointments.slice(0, 5)"
                :key="appt.id"
                class="flex justify-between items-center text-sm"
              >
                <span>{{ appt.pet_name }} ({{ appt.appointment_time }})</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-lg p-4 shadow col-span-2">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-sm font-semibold">Appointments by Status</h3>
              <select
                v-model="summaryFilter"
                @change="handleSummaryFilter"
                class="text-xs border border-gray-300 rounded px-2 py-1"
              >
                <option value="status">By Status</option>
                <option value="date">By Date (Last 7 Days)</option>
              </select>
            </div>
            <div class="h-48">
              <Bar
                :data="{
                  labels: appointmentsByStatus.map((item) => item.label),
                  datasets: [
                    {
                      label: 'Appointments',
                      data: appointmentsByStatus.map((item) => item.count),
                      backgroundColor: [
                        '#3b82f6',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444',
                      ],
                      borderColor: ['#1e3a8a', '#065f46', '#b45309', '#991b1b'],
                      borderWidth: 1,
                    },
                  ],
                }"
                :options="{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: 'Number of Appointments' },
                    },
                    x: {
                      title: {
                        display: true,
                        text: summaryFilter === 'status' ? 'Status' : 'Date',
                      },
                    },
                  },
                  plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true },
                  },
                }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
