<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div class="animate-fade-in-left">
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Professional 
            <span class="text-blue-600">Veterinary Care</span>
            for Your Beloved Pets
          </h1>
          <p class="text-xl text-gray-600 mb-8">
            Comprehensive veterinary services with state-of-the-art facilities and compassionate care for all your furry family members.
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <router-link 
              to="/appointment"
              class="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 text-center"
            >
              Book Appointment
            </router-link>
            <router-link 
              to="/services"
              class="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200 text-center"
            >
              Our Services
            </router-link>
          </div>
        </div>
        <div class="animate-fade-in-right">
          <div class="relative">
             <img :src="settingsStore.photoUrl" alt="Clinic photo" class="rounded-lg shadow-lg">
            <div class="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-lg animate-bounce-slow">
              <div class="flex items-center">
                <Award class="h-8 w-8 text-yellow-500 mr-3" />
                <div>
                  <p class="font-semibold text-gray-800">Award Winning</p>
                  <p class="text-sm text-gray-600">Veterinary Clinic</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="bg-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div v-for="stat in stats" :key="stat.label" class="text-center animate-fade-in-up">
            <div class="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{{ stat.value }}</div>
            <div class="text-gray-600">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Award } from 'lucide-vue-next'
import { stats } from '@/data/stats.js'
import { useSettingsStore } from '@/stores/settings';
import { onMounted } from 'vue';

export default {
  name: 'HomeView',
  components: { Award },
  setup() {
    const settingsStore = useSettingsStore();
    onMounted(() => {
      settingsStore.loadSettings();
    });
    return { settingsStore };
  },
  data() {
    return {
      stats
    }
  }
}
</script>
