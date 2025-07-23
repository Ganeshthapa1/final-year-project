<template>
  <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" @click.self="$emit('close')">
    <div class="bg-white rounded-lg p-6 w-full max-w-md mx-2 animate-scale-in" @click.stop>
      <h2 class="text-lg font-semibold mb-4">{{ isEdit ? 'Edit Pet' : 'Add New Pet' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Left Column -->
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium mb-1">Name</label>
              <input v-model="form.name" required class="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Breed</label>
              <input v-model="form.breed" required class="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Species</label>
              <select v-model="form.species" required class="w-full px-3 py-2 border rounded">
                <option value="">Select</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
                <option value="rabbit">Rabbit</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Owner Name</label>
              <input v-model="form.owner_name" required class="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Owner Email</label>
              <input v-model="form.owner_email" type="email" required class="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Owner Phone</label>
              <input v-model="form.owner_phone" class="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Owner Address</label>
              <input v-model="form.owner_address" class="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Age (years)</label>
              <input v-model.number="form.age" type="number" min="0" class="w-full px-3 py-2 border rounded" />
            </div>
          </div>
          <!-- Right Column -->
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium mb-1">Weight (kg)</label>
              <input v-model.number="form.weight" type="number" min="0" class="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Color</label>
              <input v-model="form.color" class="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Gender</label>
              <select v-model="form.gender" class="w-full px-3 py-2 border rounded">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Microchip ID</label>
              <input v-model="form.microchip_id" class="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Medical Notes</label>
              <textarea v-model="form.medical_notes" class="w-full px-3 py-2 border rounded"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Last Visit</label>
              <input v-model="form.last_visit" type="date" class="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Next Appointment</label>
              <input v-model="form.next_appointment" type="date" class="w-full px-3 py-2 border rounded" />
            </div>
          </div>
        </div>
        <div class="flex justify-end mt-6 space-x-2">
          <button type="button" @click="$emit('close')" class="px-4 py-2 rounded bg-gray-100 text-gray-700">Cancel</button>
          <button type="submit" :disabled="loading" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
            {{ loading ? 'Saving...' : (isEdit ? 'Update' : 'Add') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PetFormModal',
  props: {
    show: Boolean,
    isEdit: Boolean,
    pet: Object
  },
  data() {
    return {
      form: {
        name: '',
        breed: '',
        species: '',
        owner_name: '',
        owner_email: '',
        owner_phone: '',
        owner_address: '',
        age: '',
        weight: '',
        color: '',
        gender: '',
        microchip_id: '',
        medical_notes: '',
        last_visit: '',
        next_appointment: ''
      },
      loading: false
    }
  },
  watch: {
    pet: {
      immediate: true,
      handler(newVal) {
        if (this.isEdit && newVal) {
          this.form = {
            name: newVal.name || '',
            breed: newVal.breed || '',
            species: newVal.species || '',
            owner_name: newVal.owner_name || '',
            owner_email: newVal.owner_email || '',
            owner_phone: newVal.owner_phone || '',
            owner_address: newVal.owner_address || '',
            age: newVal.age || '',
            weight: newVal.weight || '',
            color: newVal.color || '',
            gender: newVal.gender || '',
            microchip_id: newVal.microchip_id || '',
            medical_notes: newVal.medical_notes || '',
            last_visit: newVal.last_visit || '',
            next_appointment: newVal.next_appointment || ''
          }
        } else {
          this.form = {
            name: '',
            breed: '',
            species: '',
            owner_name: '',
            owner_email: '',
            owner_phone: '',
            owner_address: '',
            age: '',
            weight: '',
            color: '',
            gender: '',
            microchip_id: '',
            medical_notes: '',
            last_visit: '',
            next_appointment: ''
          }
        }
      }
    }
  },
  methods: {
    async handleSubmit() {
      this.loading = true
      try {
        if (this.isEdit) {
          this.$emit('update', { ...this.form })
        } else {
          this.$emit('create', { ...this.form })
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
