<template>
  <nav class="bg-white shadow-lg fixed w-full top-0 z-50 transition-all duration-300" 
       :class="{ 'bg-white/95 backdrop-blur-sm': scrolled }">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0 flex items-center">
            <Heart class="h-8 w-8 text-blue-600 mr-2" />
            <span class="text-xl font-bold text-gray-800">{{settingsStore.websitename}}</span>
          </div>
        </div>
        
        <!-- Desktop Navigation -->
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <a v-for="item in navItems" :key="item.name" 
               @click="$emit('set-active-section', item.id)"
               :class="{ 'text-blue-600 border-b-2 border-blue-600': activeSection === item.id }"
               class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer transition-all duration-200">
              {{ item.name }}
            </a>
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
    <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <a v-for="item in navItems" :key="item.name"
           @click="$emit('set-active-section', item.id); mobileMenuOpen = false"
           :class="{ 'text-blue-600 bg-blue-50': activeSection === item.id }"
           class="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium cursor-pointer transition-all duration-200">
          {{ item.name }}
        </a>
      </div>
    </div>
  </nav>
</template>

<script>
import { Heart, Menu, X } from 'lucide-vue-next'
import { navItems } from '../data/navigation.js'

export default {
  name: 'AppNavigation',
  components: { Heart, Menu, X },
  props: {
    activeSection: String,
    scrolled: Boolean
  },
  emits: ['set-active-section'],
  data() {
    return {
      mobileMenuOpen: false,
      navItems
    }
  }
}
</script>
