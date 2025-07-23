<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="$emit('close')">
    <div class="bg-white rounded-lg p-8 max-w-lg w-full mx-4 animate-scale-in" @click.stop>
      <h3 class="text-xl font-semibold text-gray-900 mb-4">Doctor Details</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">First Name</label>
          <div class="text-base text-gray-900">{{ doctor.first_name }}</div>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Last Name</label>
          <div class="text-base text-gray-900">{{ doctor.last_name }}</div>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Email</label>
          <div class="text-base text-gray-900">{{ doctor.email }}</div>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Phone</label>
          <div class="text-base text-gray-900">{{ doctor.phone }}</div>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Specialization</label>
          <div class="text-base text-gray-900">{{ doctor.specialization }}</div>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Experience (years)</label>
          <div class="text-base text-gray-900">{{ doctor.experience_years }}</div>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Status</label>
          <div class="text-base text-gray-900">{{ doctor.status }}</div>
        </div>
      </div>
      <div class="flex justify-end mt-8">
        <button @click="$emit('close')" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DoctorViewModal',
  props: {
    doctor: { type: Object, required: true }
  }
}
</script>
