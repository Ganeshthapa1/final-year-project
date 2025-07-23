<template>
  <nav class="bg-white shadow-lg fixed w-full top-0 z-50 transition-all duration-300" 
       :class="{ 'bg-white/95 backdrop-blur-sm': scrolled }">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <router-link to="/" class="flex-shrink-0 flex items-center">
            <Heart class="h-8 w-8 text-blue-600 mr-2" />
            <span class="text-xl font-bold text-gray-800">{{ settingsStore.websiteName }}</span>
          </router-link>
        </div>
        
        <!-- Desktop Navigation -->
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <router-link 
              v-for="item in navItems" 
              :key="item.name" 
              :to="item.path"
              :class="{ 'text-blue-600 border-b-2 border-blue-600': $route.path === item.path }"
              class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-all duration-200"
            >
              {{ item.name }}
            </router-link>
            <!-- Add this to the desktop navigation links -->
            <router-link 
              to="/login"
              :class="{ 'text-blue-600 border-b-2 border-blue-600': $route.path === '/login' }"
              class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-all duration-200"
            >
              Admin
            </router-link>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-gray-700 hover:text-blue-600">
            <Menu v-if="!mobileMenuOpen" class="h-6 w-6" />
            <X v-else class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <transition name="fade">
      <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t shadow-lg">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <router-link 
            v-for="item in navItems" 
            :key="item.name"
            :to="item.path"
            @click="mobileMenuOpen = false"
            :class="{ 'text-blue-600 bg-blue-50': $route.path === item.path }"
            class="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium transition-all duration-200"
          >
            {{ item.name }}
          </router-link>
          <!-- Also add to mobile navigation -->
          <router-link 
            to="/admin/appointments"
            @click="mobileMenuOpen = false"
            :class="{ 'text-blue-600 bg-blue-50': $route.path === '/admin/appointments' }"
            class="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium transition-all duration-200"
          >
            Admin
          </router-link>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script>
import { Heart, Menu, X } from 'lucide-vue-next'
import { navItems } from '@/data/navigation.js'
import { useSettingsStore } from '@/stores/settings';

export default {
  name: 'AppNavigation',
  components: { Heart, Menu, X },
  data() {
    return {
      mobileMenuOpen: false,
      scrolled: false,
      navItems
    }
  },
  setup() {
    const settingsStore = useSettingsStore();
    window.addEventListener('settings-updated', () => {
      settingsStore.websiteName = settingsStore.websiteName;
    });
    return { settingsStore };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      this.scrolled = window.scrollY > 50
    }
  }
}
</script>
