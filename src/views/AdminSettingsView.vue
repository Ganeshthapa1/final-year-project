<template>
  <AdminLayout>
    <div class="p-8 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Admin Settings</h1>
    <p class="text-gray-600 mb-6">Manage your admin settings here.</p>
    <form class="space-y-6 bg-white p-6 rounded-lg shadow">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Website Name</label>
        <input v-model="form.websiteName" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input v-model="form.email" type="email" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Phone No</label>
        <input v-model="form.phone" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <input v-model="form.address" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">District</label>
        <input v-model="form.district" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">About Us</label>
        <textarea v-model="form.about" rows="3" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
      </div>
      <div class="flex flex-col md:flex-row md:space-x-6">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Photo</label>
          <input type="file" @change="onPhotoChange" accept="image/*" class="w-full" />
          <div v-if="form.photoUrl" class="mt-2">
            <img :src="form.photoUrl" alt="Preview" class="h-24 w-24 object-cover rounded-full border" />
          </div>
        </div>
        <div class="flex-1 mt-6 md:mt-0">
          <label class="block text-sm font-medium text-gray-700 mb-1">Photo 2</label>
          <input type="file" @change="onPhoto1Change" accept="image/*" class="w-full" />
          <div v-if="form.photo1Url" class="mt-2">
            <img :src="form.photo1Url" alt="Preview" class="h-24 w-24 object-cover rounded-full border" />
          </div>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Facebook Link</label>
        <input v-model="form.facebook" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Instagram Link</label>
        <input v-model="form.instagram" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">LinkedIn Link</label>
        <input v-model="form.linkedin" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div class="pt-4">
        <button type="button" @click="saveSettings" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">Save Settings</button>
      </div>
    </form>
  </div>
  </AdminLayout>
</template>

<script>
import { useSettingsStore } from '@/stores/settings';
import AdminLayout from '@/components/layout/AdminLayout.vue';

export default {
  name: 'AdminSettingsView',
  components: {
    AdminLayout
  },
  data() {
    return {
      form: {
        websiteName: '',
        email: '',
        phone: '',
        address: '',
        district: '',
        about: '',
        photo: null,
        photoUrl: '',
        photo1: null,
        photo1Url: '',
        facebook: '',
        instagram: '',
        linkedin: ''
      }
    }
  },
  mounted() {
    const settingsStore = useSettingsStore();
    settingsStore.loadSettings().then(() => {
      this.form.websiteName = settingsStore.websiteName;
      this.form.address = settingsStore.address;
      this.form.district = settingsStore.district;
      this.form.phone = settingsStore.phone;
      this.form.email = settingsStore.email;
      this.form.about = settingsStore.about;
      this.form.photoUrl = settingsStore.photoUrl;
      this.form.photo1Url = settingsStore.photo1Url;
      this.form.facebook = settingsStore.facebook;
      this.form.instagram = settingsStore.instagram;
      this.form.linkedin = settingsStore.linkedin;
    });
  },
  methods: {
    onPhotoChange(e) {
      const file = e.target.files[0];
      if (file) {
        this.form.photo = file;
        this.form.photoUrl = URL.createObjectURL(file);
      }
    },
    onPhoto1Change(e) {
      const file = e.target.files[0];
      if (file) {
        this.form.photo1 = file;
        this.form.photo1Url = URL.createObjectURL(file);
      }
    },
    async saveSettings() {
      const settingsStore = useSettingsStore();
      settingsStore.setWebsiteName(this.form.websiteName);
      settingsStore.setAddress(this.form.address);
      settingsStore.setDistrict(this.form.district);
      settingsStore.setPhone(this.form.phone);
      settingsStore.setEmail(this.form.email);
      settingsStore.setAbout(this.form.about);
      settingsStore.setPhotoUrl(this.form.photoUrl);
      settingsStore.setPhoto1Url(this.form.photo1Url);
      settingsStore.setFacebook(this.form.facebook);
      settingsStore.setInstagram(this.form.instagram);
      settingsStore.setLinkedin(this.form.linkedin);
      await settingsStore.saveSettingsToBackend();
      window.dispatchEvent(new Event('settings-updated'));
    }
  }
}
</script>

<style scoped>
/* Uses global css for form and button styling */
</style>
