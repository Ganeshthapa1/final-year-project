<template>
  <footer class="bg-gray-900 text-white py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div class="flex items-center mb-4">
            <Heart class="h-8 w-8 text-blue-400 mr-2" />
            <span class="text-xl font-bold">{{ settingsStore.websiteName }}</span>
          </div>
          <p class="text-gray-400 mb-4">
            Providing exceptional veterinary care with compassion and expertise for over 15 years.
          </p>
          <div class="flex space-x-4">
            <div v-if="settingsStore.facebook" class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
              <a :href="settingsStore.facebook" target="_blank" rel="noopener">
                <Facebook class="w-5 h-5" />
              </a>
            </div>
            <div v-if="settingsStore.instagram" class="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-pink-700 transition-colors">
              <a :href="settingsStore.instagram" target="_blank" rel="noopener">
                <Instagram class="w-5 h-5" />
              </a>
            </div>
            <div v-if="settingsStore.linkedin" class="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-500 transition-colors">
              <a :href="settingsStore.linkedin" target="_blank" rel="noopener">
                <Linkedin class="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li><a @click="$emit('set-active-section', 'home')" class="text-gray-400 hover:text-white cursor-pointer transition-colors">Home</a></li>
            <li><a @click="$emit('set-active-section', 'about')" class="text-gray-400 hover:text-white cursor-pointer transition-colors">About Us</a></li>
            <li><a @click="$emit('set-active-section', 'services')" class="text-gray-400 hover:text-white cursor-pointer transition-colors">Services</a></li>
            <li><a @click="$emit('set-active-section', 'appointment')" class="text-gray-400 hover:text-white cursor-pointer transition-colors">Book Appointment</a></li>
          </ul>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-4">Services</h3>
          <ul class="space-y-2">
            <li><span class="text-gray-400">General Checkups</span></li>
            <li><span class="text-gray-400">Vaccinations</span></li>
            <li><span class="text-gray-400">Surgery</span></li>
            <li><span class="text-gray-400">Emergency Care</span></li>
          </ul>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-4">Contact Info</h3>
          <div class="space-y-2 text-gray-400">
            <p>{{ settingsStore.address }}</p>
            <p>{{ settingsStore.district }}</p>
            <p>{{ settingsStore.phone }}</p>
            <p>{{ settingsStore.email }}</p>
          </div>
        </div>
      </div>
      <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; {{ new Date().getFullYear() }} {{settingsStore.websitename}}. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script>
import { Heart, Facebook, Instagram, Linkedin } from 'lucide-vue-next'
import { useSettingsStore } from '@/stores/settings'

export default {
  name: 'AppFooter',
  components: { Heart, Facebook, Instagram, Linkedin },
  emits: ['set-active-section'],
  setup() {
    const settingsStore = useSettingsStore();
    // Load settings on mount
    settingsStore.loadSettings();
    // Reload settings when settings-updated event is fired
    window.addEventListener('settings-updated', () => {
      settingsStore.loadSettings();
    });
    return { settingsStore };
  },
}
</script>
