<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-8 max-w-md mx-4 animate-scale-in">
      <div class="text-center">
        <CheckCircle class="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ title }}</h3>
        <p class="text-gray-600 mb-6">{{ message }}</p>
        <button @click="$emit('close')"
                class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { CheckCircle } from 'lucide-vue-next'

export default {
  name: 'SuccessModal',
  components: { CheckCircle },
  props: {
    title: String,
    message: String
  },
  emits: ['close']
}
</script>
