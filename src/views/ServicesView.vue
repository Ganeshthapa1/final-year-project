<template>
  <div class="min-h-screen bg-gray-50 py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 animate-fade-in-up">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive veterinary services to keep your pets healthy and happy throughout their lives.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="service in services" :key="service.name"
             class="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up">
          <div class="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-4">
            <component :is="service.icon" class="h-8 w-8 text-blue-600" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ service.name }}</h3>
          <p class="text-gray-600 mb-4">{{ service.description }}</p>
          <ul class="space-y-2">
            <li v-for="feature in service.features" :key="feature" class="flex items-center text-sm text-gray-600">
              <CheckCircle class="h-4 w-4 text-green-500 mr-2" />
              {{ feature }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CheckCircle, Stethoscope, Syringe, Scissors, Shield, Activity, Users } from 'lucide-vue-next'
import { services } from '@/data/services.js'

export default {
  name: 'ServicesView',
  components: { 
    CheckCircle, 
    Stethoscope, 
    Syringe, 
    Scissors, 
    Shield, 
    Activity, 
    Users 
  },
  data() {
    return {
      services
    }
  }
}
</script>
