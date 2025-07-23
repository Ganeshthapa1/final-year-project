<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="$emit('close')">
    <div class="bg-white rounded-lg p-8 max-w-lg w-full mx-4 animate-scale-in" @click.stop>
      <h3 class="text-xl font-semibold text-gray-900 mb-4">{{ isEdit ? 'Edit Doctor' : 'Add New Doctor' }}</h3>
      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">First Name</label>
            <input v-model="form.first_name" required class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Last Name</label>
            <input v-model="form.last_name" required class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input v-model="form.email" type="email" required class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Phone</label>
            <input v-model="form.phone" class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Specialization</label>
            <input v-model="form.specialization" class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Experience (years)</label>
            <input v-model.number="form.experience_years" type="number" min="0" class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Status</label>
            <select v-model="form.status" class="w-full px-3 py-2 border rounded">
              <option v-for="status in availableStatuses" :key="status" :value="status">{{ status }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Photo</label>
            <input type="file" accept="image/*" @change="handlePhotoUpload" class="w-full px-3 py-2 border rounded" />
            <div v-if="form.profile_image" class="mt-2">
              <img :src="form.profile_image" alt="Doctor Photo" class="h-16 w-16 rounded-full object-cover border" />
            </div>
          </div>
        </div>
        <div class="flex justify-end mt-6 space-x-2">
          <button type="button" @click="$emit('close')" class="px-4 py-2 rounded bg-gray-100 text-gray-700">Cancel</button>
          <button type="submit" :disabled="loading" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
            {{ loading ? 'Saving...' : (isEdit ? 'Update' : 'Add') }} Doctor
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'DoctorFormModal',
  props: {
    show: Boolean,
    isEdit: Boolean,
    doctor: Object,
    availableStatuses: {
      type: Array,
      default: () => ["active", "inactive"]
    }
  },
  data() {
    return {
      form: {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        specialization: '',
        experience_years: 0,
        status: 'active',
        profile_image: ''
      },
      loading: false,
      error: ''
    }
  },
  watch: {
    doctor: {
      immediate: true,
      handler(newVal) {
        if (this.isEdit && newVal) {
          // Always ensure status is a string and matches availableStatuses
          this.form = { ...newVal, status: String(newVal.status) };
          // If status is not in availableStatuses, add it
          if (!this.availableStatuses.includes(this.form.status)) {
            this.availableStatuses.push(this.form.status);
          }
        } else {
          this.form = {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            specialization: '',
            experience_years: 0,
            status: 'active',
            profile_image: ''
          };
        }
      }
    }
  },
  methods: {
    handlePhotoUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.form.profile_image = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    async handleSubmit() {
      this.loading = true;
      this.error = '';
      try {
        // Ensure all required fields are present and not undefined/null
        if (!this.form.first_name || !this.form.last_name || !this.form.email) {
          this.error = 'First name, last name, and email are required.';
          this.loading = false;
          return;
        }
        const payload = {
          first_name: this.form.first_name,
          last_name: this.form.last_name,
          email: this.form.email,
          phone: this.form.phone || '',
          specialization: this.form.specialization || '',
          experience_years: typeof this.form.experience_years === 'number' ? this.form.experience_years : 0,
          status: this.form.status || 'active',
          profile_image: this.form.profile_image || ''
        }
        this.$emit('submit', payload);
      } catch (e) {
        this.error = e.message || 'An error occurred.';
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>
