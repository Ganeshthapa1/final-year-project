<template>
  <section class="min-h-screen bg-white py-20">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 animate-fade-in-up">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">Book an Appointment</h2>
        <p class="text-xl text-gray-600">
          Schedule a visit for your pet today. We're here to help with all your veterinary needs.
        </p>
      </div>

      <div class="bg-gray-50 rounded-lg p-8 animate-fade-in-up">
        <form @submit.prevent="submitAppointment" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Pet Owner Name</label>
              <input v-model="form.ownerName" type="text" required
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input v-model="form.phone" type="tel" required
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Pet Name</label>
              <input v-model="form.petName" type="text" required
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Pet Type</label>
              <select v-model="form.petType" required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Select pet type</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
                <option value="rabbit">Rabbit</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
              <input v-model="form.date" type="date" required
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
              <select v-model="form.time" required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Select time</option>
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Service Needed</label>
            <select v-model="form.service" required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Select service</option>
              <option value="checkup">General Checkup</option>
              <option value="vaccination">Vaccination</option>
              <option value="surgery">Surgery</option>
              <option value="dental">Dental Care</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
            <textarea v-model="form.notes" rows="4"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Please describe your pet's symptoms or any specific concerns..."></textarea>
          </div>
          <button type="submit" 
                  class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200">
            Book Appointment
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AppointmentSection',
  emits: ['show-success'],
  data() {
    return {
      form: {
        ownerName: '',
        phone: '',
        petName: '',
        petType: '',
        date: '',
        time: '',
        service: '',
        notes: ''
      }
    }
  },
  methods: {
    submitAppointment() {
      this.$emit('show-success', {
        title: 'Appointment Booked!',
        message: 'Your appointment has been successfully scheduled. We will contact you soon to confirm the details.'
      })
      this.resetForm()
    },
    resetForm() {
      this.form = {
        ownerName: '',
        phone: '',
        petName: '',
        petType: '',
        date: '',
        time: '',
        service: '',
        notes: ''
      }
    }
  }
}
</script>
