<template>
  <div class="min-h-screen bg-white py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 animate-fade-in-up">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">About {{settingsStore.websiteName}}</h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
         {{ settingsStore.about }}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        <div class="animate-fade-in-left">
           <img :src="settingsStore.photo1Url" alt="Our clinic" class="rounded-lg shadow-lg">
        </div>
        <div class="animate-fade-in-right">
          <h3 class="text-2xl font-bold text-gray-900 mb-6">Our Mission</h3>
          <p class="text-gray-600 mb-6">
            We believe every pet deserves the highest quality medical care. Our team of experienced veterinarians and support staff work together to ensure your pets receive comprehensive, compassionate care in a comfortable environment.
          </p>
          <div class="space-y-4">
            <div v-for="feature in features" :key="feature" class="flex items-center">
              <CheckCircle class="h-6 w-6 text-green-500 mr-3" />
              <span class="text-gray-700">{{ feature }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Team Section -->
      <div class="animate-fade-in-up">
        <h3 class="text-3xl font-bold text-center text-gray-900 mb-12">Meet Our Team</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="member in teamMembers" :key="member.name" 
               class="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
            <img :src="member.image" :alt="member.name" class="w-32 h-32 rounded-full mx-auto mb-4 object-cover">
            <h4 class="text-xl font-semibold text-gray-900 mb-1">{{ member.name }}</h4>
            <p class="text-blue-600 font-medium mb-0.5">{{ member.role }}</p>
            <p class="text-gray-600 mb-1">{{ member.experience_years }}</p>
            <p class="text-gray-600 text-sm mb-1">{{ member.email }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CheckCircle } from 'lucide-vue-next'
import { useSettingsStore } from '@/stores/settings';
import { onMounted, ref } from 'vue';
import { fetchTeamMembers } from '../data/team';

export default {
  name: 'AboutView',
  components: { CheckCircle },
  setup() {
    const settingsStore = useSettingsStore();
    const teamMembers = ref([]);
    onMounted(async () => {
      settingsStore.loadSettings();
      teamMembers.value = await fetchTeamMembers();
    });
    return { settingsStore, teamMembers };
  },
  data() {
    return {
      features: [
        '24/7 Emergency Care Available',
        'State-of-the-art Medical Equipment',
        'Experienced Veterinary Team',
        'Comprehensive Pet Care Services'
      ]
    }
  }
}
</script>
