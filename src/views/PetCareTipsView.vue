<template>
  <div class="min-h-screen bg-white py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 animate-fade-in-up">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">Pet Care Tips</h2>
        <p class="text-xl text-gray-600">
          Expert advice to keep your pets healthy and happy at home.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="tip in petCareTips" :key="tip.title"
             class="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up">
          <div class="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-4">
            <component :is="tip.icon" class="h-8 w-8 text-blue-600" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ tip.title }}</h3>
          <p class="text-gray-600 mb-4">{{ tip.description }}</p>
          <ul class="space-y-2">
            <li v-for="point in tip.tips" :key="point" class="flex items-start text-sm text-gray-600">
              <CheckCircle class="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              {{ point }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CheckCircle, Heart, Activity, Shield } from 'lucide-vue-next'
import { petCareTips } from '@/data/petCareTips.js'

export default {
  name: 'PetCareTipsView',
  components: { CheckCircle, Heart, Activity, Shield },
  data() {
    return {
      petCareTips
    }
  }
}
</script>
