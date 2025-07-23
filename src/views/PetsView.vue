<template>
  <AdminLayout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Pets</h1>
        <!-- <button
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          @click="openCreateModal"
        >
          Add New Pet
        </button> -->
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
              type="text"
              placeholder="Search pets..."
              v-model="searchQuery"
              @input="filterPets"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="flex-1 min-w-48">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Species</label
            >
            <select
              v-model="filters.species"
              @change="filterPets"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Species</option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="bird">Bird</option>
              <option value="rabbit">Rabbit</option>
            </select>
          </div>
          <div class="flex-1 min-w-48">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Age Range</label
            >
            <select
              v-model="filters.ageRange"
              @change="filterPets"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Ages</option>
              <option value="young">Puppy/Kitten (0-1 year)</option>
              <option value="adult">Young (1-3 years)</option>
              <option value="mature">Adult (3-8 years)</option>
              <option value="senior">Senior (8+ years)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center"
      >
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"
        ></div>
        <p class="text-gray-500">Loading pets...</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <svg
              class="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error loading pets</h3>
            <p class="text-sm text-red-700 mt-1">{{ error }}</p>
            <button
              @click="fetchPets"
              class="mt-2 text-sm text-red-600 hover:text-red-500 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>

      <!-- Pets Grid -->
      <div
        v-else-if="filteredPets.length === 0"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center"
      >
        <svg
          class="mx-auto h-12 w-12 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        <h3 class="text-sm font-medium text-gray-900 mb-1">No pets found</h3>
        <p class="text-sm text-gray-500">
          Try adjusting your search criteria or add a new pet.
        </p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="pet in filteredPets"
          :key="pet.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">
                    {{ pet.name || "Unknown Pet" }}
                  </h3>
                  <!-- <p class="text-sm text-gray-500">
                    {{ pet.breed || "Unknown Breed" }}
                  </p> -->
                </div>
              </div>
              <span
                :class="getSpeciesColor(pet.species)"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ formatSpecies(pet.species) }}
              </span>
            </div>
            <!-- <div class="space-y-2 mb-4">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Owner:</span>
                <span class="text-gray-900">{{
                  pet.owner?.name || pet.owner_name || "Unknown Owner"
                }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Age:</span>
                <span class="text-gray-900">{{
                  formatAge(pet.age, pet.birth_date)
                }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Weight:</span>
                <span class="text-gray-900">{{
                  formatWeight(pet.weight)
                }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Last Visit:</span>
                <span class="text-gray-900">{{
                  formatDate(pet.last_visit)
                }}</span>
              </div>
            </div> -->
            <div class="flex space-x-2">
              <!-- <button
                @click="viewPetDetails(pet)"
                class="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
              >
                View Details
              </button> -->
              <!-- <button
                @click="openEditModal(pet)"
                class="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Edit
              </button> -->
              <button
                @click="deletePet(pet)"
                class="px-3 py-2 border border-red-300 rounded-md text-sm text-red-700 hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      <PetFormModal
        v-if="showModal"
        :show="showModal"
        :isEdit="isEdit"
        :pet="selectedPet"
        @close="closeModal"
        @create="createPet"
        @update="updatePet"
      />
    </div>
  </AdminLayout>
</template>

<script>
import AdminLayout from "@/components/layout/AdminLayout.vue";
import PetFormModal from "../components/ui/PetFormModal.vue";
import { petService } from "@/services/petService.js";

export default {
  name: "PetsView",
  components: {
    AdminLayout,
    PetFormModal,
  },
  data() {
    return {
      pets: [],
      filteredPets: [],
      searchQuery: "",
      filters: {
        species: "",
        ageRange: "",
      },
      loading: false,
      error: null,
      showModal: false,
      isEdit: false,
      selectedPet: null,
    };
  },
  async mounted() {
    await this.fetchPets();
  },
  methods: {
    async fetchPets() {
      this.loading = true;
      this.error = null;

      try {
        console.log("Attempting to fetch pets from API...");

        const response = await petService.getPets();

        // Handle different response structures
        if (Array.isArray(response)) {
          this.pets = response;
        } else if (response.data && Array.isArray(response.data)) {
          this.pets = response.data;
        } else if (response.pets && Array.isArray(response.pets)) {
          this.pets = response.pets;
        } else {
          this.pets = [];
        }

        this.filterPets();
        console.log(
          "Successfully loaded pets from API:",
          this.pets.length,
          "pets"
        );
      } catch (error) {
        console.error("Error fetching pets from API:", error);
        console.log("Falling back to mock data");
        this.error = "Could not connect to server. Using demo data.";

        this.filterPets();
      } finally {
        this.loading = false;
      }
    },

    filterPets() {
      let filtered = [...this.pets];

      // Search filter
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (pet) =>
            (pet.name || "").toLowerCase().includes(query) ||
            (pet.breed || "").toLowerCase().includes(query) ||
            (pet.owner_name || pet.owner?.name || "")
              .toLowerCase()
              .includes(query)
        );
      }

      // Species filter
      if (this.filters.species) {
        filtered = filtered.filter(
          (pet) =>
            (pet.species || "").toLowerCase() ===
            this.filters.species.toLowerCase()
        );
      }

      // Age range filter
      if (this.filters.ageRange) {
        filtered = filtered.filter((pet) => {
          const age = pet.age || this.calculateAge(pet.birth_date);
          switch (this.filters.ageRange) {
            case "young":
              return age <= 1;
            case "adult":
              return age > 1 && age <= 3;
            case "mature":
              return age > 3 && age <= 8;
            case "senior":
              return age > 8;
            default:
              return true;
          }
        });
      }

      this.filteredPets = filtered;
    },

    calculateAge(birthDate) {
      if (!birthDate) return 0;
      const today = new Date();
      const birth = new Date(birthDate);
      return Math.floor((today - birth) / (365.25 * 24 * 60 * 60 * 1000));
    },

    viewPetDetails(pet) {
      console.log("Viewing pet details:", pet);
      alert(`Viewing details for ${pet.name}`);
    },

    editPet(pet) {
      console.log("Editing pet:", pet);
      this.openEditModal(pet);
    },

    async createPet(data) {
      this.loading = true;
      try {
        await petService.createPet(data);
        await this.fetchPets();
        this.closeModal();
      } catch (e) {
        this.error = "Failed to add pet.";
      } finally {
        this.loading = false;
      }
    },
    async updatePet(data) {
      this.loading = true;
      try {
        await petService.updatePet(this.selectedPet.id, data);
        await this.fetchPets();
        this.closeModal();
      } catch (e) {
        this.error = "Failed to update pet.";
      } finally {
        this.loading = false;
      }
    },
    async deletePet(pet) {
      if (!confirm(`Are you sure you want to delete ${pet.name}?`)) return;
      this.loading = true;
      try {
        await petService.deletePet(pet.id);
        await this.fetchPets();
      } catch (e) {
        this.error = "Failed to delete pet.";
      } finally {
        this.loading = false;
      }
    },
    openCreateModal() {
      this.isEdit = false;
      this.selectedPet = null;
      this.showModal = true;
    },
    openEditModal(pet) {
      this.isEdit = true;
      this.selectedPet = { ...pet };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    getSpeciesColor(species) {
      const colors = {
        dog: "bg-blue-100 text-blue-800",
        cat: "bg-purple-100 text-purple-800",
        bird: "bg-green-100 text-green-800",
        rabbit: "bg-orange-100 text-orange-800",
      };
      return colors[species?.toLowerCase()] || "bg-gray-100 text-gray-800";
    },

    formatSpecies(species) {
      if (!species) return "Unknown";
      return species.charAt(0).toUpperCase() + species.slice(1);
    },

    formatAge(age, birthDate) {
      if (age) {
        return `${age} year${age !== 1 ? "s" : ""}`;
      } else if (birthDate) {
        const calculatedAge = this.calculateAge(birthDate);
        return `${calculatedAge} year${calculatedAge !== 1 ? "s" : ""}`;
      }
      return "Unknown";
    },

    formatWeight(weight) {
      if (!weight) return "Unknown";
      return `${weight} kg`;
    },

    formatDate(date) {
      if (!date) return "Never";
      return new Date(date).toLocaleDateString();
    },
  },
};
</script>
