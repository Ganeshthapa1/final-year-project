<template>
  <AdminLayout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Appointments</h1>
        <button 
          @click="openNewAppointmentModal"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          New Appointment
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div class="flex flex-wrap gap-4">
          <div class="flex-1 min-w-48">
            <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input 
              type="date" 
              v-model="filters.date"
              @change="fetchAppointments"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div class="flex-1 min-w-48">
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select 
              v-model="filters.status"
              @change="fetchAppointments"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div class="flex-1 min-w-48">
            <label class="block text-sm font-medium text-gray-700 mb-2">Doctor</label>
            <select 
              v-model="filters.doctor"
              @change="fetchAppointments"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Doctors</option>
              <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">
                {{ doctor.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-500">Loading appointments...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error loading appointments</h3>
            <p class="text-sm text-red-700 mt-1">{{ error }}</p>
            <button 
              @click="fetchAppointments" 
              class="mt-2 text-sm text-red-600 hover:text-red-500 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>

      <!-- Appointments List -->
      <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">
            {{ filters.date ? 'Appointments for ' + formatDate(filters.date) : 'All Appointments' }}
            <span class="text-sm font-normal text-gray-500 ml-2">({{ appointments.length }} total)</span>
          </h2>
        </div>
        
        <div v-if="appointments.length === 0" class="px-6 py-8 text-center text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 class="text-sm font-medium text-gray-900 mb-1">No appointments found</h3>
          <p class="text-sm text-gray-500">Try adjusting your filters or create a new appointment.</p>
        </div>
        
        <div v-else class="divide-y divide-gray-200">
          <div v-for="appointment in appointments" :key="appointment.id" class="px-6 py-4 hover:bg-gray-50">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span class="text-blue-600 font-medium text-xs">{{ formatTime(appointment.time) }}</span>
                  </div>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-900">
                    {{ appointment.pet_name || 'Unknown Pet' }}
                  </h3>
                  <p class="text-sm text-gray-500">
                    {{ appointment.client_name || 'Unknown Owner' }}
                  </p>
                  <p class="text-xs text-gray-400">
                    {{ appointment.reason || 'General Consultation' }}
                  </p>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <span class="text-sm text-gray-500">
                  {{ appointment.doctor_name || 'Unassigned' }}
                </span>
                <span :class="getStatusClass(appointment.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ formatStatus(appointment.status) }}
                </span>
                <button 
                  @click="viewAppointment(appointment)"
                  class="text-blue-600 hover:text-blue-900 text-sm"
                >
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script>
import AdminLayout from '@/components/layout/AdminLayout.vue';
import { appointmentService } from '@/services/appointmentService.js';

export default {
  name: 'AppointmentsView',
  components: {
    AdminLayout
  },
  data() {
    return {
      appointments: [],
      doctors: [],
      filters: {
        date: '',
        status: '',
        doctor: ''
      },
      loading: false,
      error: null
    };
  },
  async mounted() {
    await this.fetchAppointments();
    // Set up auto-refresh every 30 seconds to check for new appointments
    this.refreshInterval = setInterval(() => {
      this.fetchAppointments();
    }, 30000);
  },
  beforeUnmount() {
    // Clean up interval when component is destroyed
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  },
  methods: {
    async fetchAppointments() {
      this.loading = true;
      this.error = null;

      try {
        console.log('Attempting to fetch appointments from API...');
        
        // Use the appointment service
        const response = await appointmentService.getAppointments(this.filters);
        
        console.log('Raw API response:', response);
        
        if (response && response.success) {
          this.appointments = response.data || [];
          console.log('Successfully loaded appointments from API:', this.appointments.length, 'appointments');
          console.log('Appointments data:', this.appointments);
        } else if (response && response.data && response.data.success) {
          this.appointments = response.data.data || [];
          console.log('Successfully loaded appointments from API:', this.appointments.length, 'appointments');
          console.log('Appointments data:', this.appointments);
        } else {
          throw new Error('Failed to fetch appointments - invalid response format');
        }
      } catch (error) {
        console.error('Error fetching appointments from API:', error);
        this.error = 'Could not connect to server.';
        this.appointments = [];
      } finally {
        this.loading = false;
      }
    },

    

    openNewAppointmentModal() {
      // TODO: Implement new appointment modal
      alert('New appointment modal will be implemented');
    },

    viewAppointment(appointment) {
      // TODO: Implement appointment details view
      console.log('Viewing appointment:', appointment);
      alert(`Viewing appointment for ${appointment.pet_name || appointment.pet?.name}`);
    },

    getStatusClass(status) {
      const classes = {
        scheduled: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
        confirmed: 'bg-purple-100 text-purple-800',
        in_progress: 'bg-yellow-100 text-yellow-800'
      };
      return classes[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
    },

    formatStatus(status) {
      if (!status) return 'Unknown';
      return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
    },

    formatTime(time) {
      if (!time) return '';

      // Handle different time formats
      if (time.includes('T')) {
        // ISO datetime format
        return new Date(time).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      } else if (time.includes(':')) {
        // Time only format (HH:MM:SS or HH:MM)
        const parts = time.split(':');
        return `${parts[0]}:${parts[1]}`;
      }

      return time;
    },

    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString();
    }
  }
}
</script>
