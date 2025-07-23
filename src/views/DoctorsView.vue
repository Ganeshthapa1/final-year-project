<template>
  <AdminLayout>
    <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Doctors</h1>
      <button @click="addNewDoctor" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        Add New Doctor
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <div class="w-6 h-6 bg-blue-600 rounded"></div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Doctors</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalDoctors }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <div class="w-6 h-6 bg-green-600 rounded"></div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Active Doctors</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.activeDoctors }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <div class="w-6 h-6 bg-purple-600 rounded"></div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Specializations</p>
            <p class="text-2xl font-bold text-gray-900">{{ uniqueSpecializations }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div class="flex flex-wrap gap-4">
        <div class="flex-1 min-w-48">
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search doctors..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        <div class="flex-1 min-w-48">
          <label class="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
          <select
            v-model="selectedSpecialization"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Specializations</option>
            <option v-for="spec in specializations" :key="spec" :value="spec">{{ spec }}</option>
          </select>
        </div>
        <div class="flex-1 min-w-48">
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="selectedStatus"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">Loading doctors...</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="doctor in filteredDoctors" :key="doctor.id" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center mb-1">
          <div class="flex-shrink-0 h-12 w-12">
            <img
              v-if="doctor.profile_image"
              :src="doctor.profile_image"
              :alt="getFullName(doctor)"
              class="h-12 w-12 rounded-full object-cover"
            >
            <div v-else class="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
              <span class="text-white font-medium text-lg">{{ getInitials(doctor) }}</span>
            </div>
          </div>
          <div class="ml-4 flex-1">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 leading-tight mb-0">{{ getFullName(doctor) }}</h3>
                <p class="text-sm text-blue-600 leading-tight mb-0">{{ doctor.specialization || 'General Practice' }}</p>
              </div>
              <span :class="getStatusColor(doctor.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                {{ doctor.status === 'active' ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </div>
        </div>

        <div class="space-y-0.5 text-sm text-gray-600 mb-1">
          <div class="flex items-center">
            <span class="font-medium w-20">Experience :</span>
            <span>{{ doctor.experience_years || 0 }} years</span>
          </div>
          <div class="flex items-center">
            <span class="font-medium w-20">Phone:</span>
            <span>{{ doctor.phone || 'N/A' }}</span>
          </div>
          <div class="flex items-center">
            <span class="font-medium w-20">Email:</span>
            <span class="truncate">{{ doctor.email }}</span>
          </div>
        </div>

        <div class="flex space-x-2">
          <button @click="viewDoctor(doctor)" class="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors">
            View Details
          </button>
          <button @click="editDoctor(doctor)" class="flex-1 bg-gray-50 text-gray-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors">
            Edit
          </button>
          <button @click="deleteDoctor(doctor)" class="bg-red-50 text-red-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-100 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>

    <div v-if="!loading && filteredDoctors.length === 0" class="text-center py-12">
      <div class="text-gray-400 text-6xl mb-4">👨‍⚕️</div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
      <p class="text-gray-600">{{ doctors.length === 0 ? 'Add your first doctor to get started.' : 'Try adjusting your search filters.' }}</p>
    </div>

    <!-- Modals -->
    <DoctorFormModal
      v-if="showFormModal"
      :show="showFormModal"
      :isEdit="isEditMode"
      :doctor="selectedDoctor"
      :availableStatuses="['active', 'inactive']"
      @close="closeFormModal"
      @submit="handleFormSubmit"
    />
    <DoctorViewModal
      v-if="showViewModal"
      :doctor="selectedDoctor"
      @close="closeViewModal"
    />
  </div>
  </AdminLayout>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { doctorService } from '../services/doctorService'
import DoctorFormModal from '../components/ui/DoctorFormModal.vue'
import DoctorViewModal from '../components/ui/DoctorViewModal.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'

export default {
  name: 'DoctorsView',
  components: { 
    DoctorFormModal, 
    DoctorViewModal,
    AdminLayout
  },
  setup() {
    const doctors = ref([])
    const stats = ref({
      totalDoctors: 0,
      activeDoctors: 0,
      inactiveDoctors: 0
    })
    const loading = ref(false)
    const searchQuery = ref('')
    const selectedSpecialization = ref('')
    const selectedStatus = ref('')
    const showFormModal = ref(false)
    const showViewModal = ref(false)
    const isEditMode = ref(false)
    const selectedDoctor = ref(null)

    // Computed property to get unique specializations for the filter dropdown
    const specializations = computed(() => {
      const specs = new Set(doctors.value.map(doctor => doctor.specialization).filter(Boolean))
      return Array.from(specs).sort()
    })

    // Computed property for the number of unique specializations in stats card
    const uniqueSpecializations = computed(() => {
      return specializations.value.length
    })

    // Computed property to filter doctors based on search query, specialization, and status
    const filteredDoctors = computed(() => {
      let filtered = doctors.value

      // Filter by search query (case-insensitive)
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(doctor =>
          doctor.first_name?.toLowerCase().includes(query) ||
          doctor.last_name?.toLowerCase().includes(query) ||
          doctor.specialization?.toLowerCase().includes(query) ||
          doctor.license_number?.toLowerCase().includes(query) ||
          doctor.email?.toLowerCase().includes(query)
        )
      }

      // Filter by selected specialization
      if (selectedSpecialization.value) {
        filtered = filtered.filter(doctor => doctor.specialization === selectedSpecialization.value)
      }

      // Filter by selected status
      if (selectedStatus.value) {
        filtered = filtered.filter(doctor => doctor.status === selectedStatus.value)
      }

      return filtered
    })

    // Function to fetch doctor data and statistics from the service
    const fetchDoctorData = async () => {
      loading.value = true
      try {
        // Use Promise.all to fetch both doctors and stats concurrently
        const [doctorsResponse, statsResponse] = await Promise.all([
          doctorService.getAll(),
          doctorService.getStats()
        ])

        // Update reactive references with fetched data
        doctors.value = doctorsResponse.data || []
        stats.value = statsResponse.data || { totalDoctors: 0, activeDoctors: 0, inactiveDoctors: 0 } // Provide a default if stats are null/undefined
      } catch (error) {
        console.error('Error fetching doctor data:', error)
        // Optionally, display an error message to the user
      } finally {
        loading.value = false
      }
    }

    // Helper function to get a doctor's full name
    const getFullName = (doctor) => {
      return `Dr. ${doctor.first_name || ''} ${doctor.last_name || ''}`.trim()
    }

    // Helper function to get a doctor's initials for the avatar
    const getInitials = (doctor) => {
      const firstInitial = doctor.first_name?.charAt(0) || '';
      const lastInitial = doctor.last_name?.charAt(0) || '';
      return `${firstInitial}${lastInitial}`.toUpperCase();
    }

    // Helper function to determine the status badge color
    const getStatusColor = (status) => {
      switch (status) {
        case 'active':
          return 'bg-green-100 text-green-800'
        case 'inactive':
          return 'bg-red-100 text-red-800'
        default:
          return 'bg-gray-100 text-gray-800' // Default color for unknown status
      }
    }

    // Placeholder functions for doctor actions
    const addNewDoctor = () => {
      selectedDoctor.value = null
      isEditMode.value = false
      showFormModal.value = true
    }

    const viewDoctor = (doctor) => {
      selectedDoctor.value = doctor
      showViewModal.value = true
    }

    const editDoctor = (doctor) => {
      selectedDoctor.value = { ...doctor }
      isEditMode.value = true
      showFormModal.value = true
    }

    const closeFormModal = () => {
      showFormModal.value = false
      selectedDoctor.value = null
      isEditMode.value = false
    }

    const closeViewModal = () => {
      showViewModal.value = false
      selectedDoctor.value = null
    }

    const handleFormSubmit = async (payload) => {
      try {
        if (isEditMode.value && selectedDoctor.value) {
          await doctorService.update(selectedDoctor.value.id, payload)
        } else {
          await doctorService.create(payload)
        }
        await fetchDoctorData()
        closeFormModal()
      } catch (e) {
        // Optionally handle error
        console.error(e)
      }
    }

    // Function to delete a doctor
    const deleteDoctor = async (doctor) => {
      if (confirm(`Are you sure you want to delete ${getFullName(doctor)}?`)) {
        try {
          await doctorService.delete(doctor.id)
          await fetchDoctorData()
        } catch (error) {
          console.error('Error deleting doctor:', error)
        }
      }
    }

    // Lifecycle hook: fetch data when the component is mounted
    onMounted(() => {
      fetchDoctorData()
    })

    // Expose reactive data and methods to the template
    return {
      doctors, // raw doctors array (not directly used in v-for after filtering)
      filteredDoctors, // The array displayed in the grid
      stats,
      loading,
      searchQuery,
      selectedSpecialization,
      selectedStatus,
      specializations, // List of unique specializations for filter dropdown
      uniqueSpecializations, // Count of unique specializations for stats card
      getFullName,
      getInitials,
      getStatusColor,
      addNewDoctor,
      viewDoctor,
      editDoctor,
      deleteDoctor,
      showFormModal,
      showViewModal,
      isEditMode,
      selectedDoctor,
      closeFormModal,
      closeViewModal,
      handleFormSubmit
    }
  }
}
</script>