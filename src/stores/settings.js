import { defineStore } from 'pinia';
import { fetchSettings, updateSettings } from '@/services/settingsService';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    websiteName: '',
    address: '',
    district: '',
    phone: '',
    email: '',
    about: '',
    photoUrl: '',
    photo1Url: '',
    facebook: '',
    instagram: '',
    linkedin: '',
  }),
  actions: {
    async loadSettings() {
      try {
        const data = await fetchSettings();
        // Map snake_case from backend to camelCase in store
        this.websiteName = data.website_name || '';
        this.address = data.address || '';
        this.district = data.district || '';
        this.phone = data.phone || '';
        this.email = data.email || '';
        this.about = data.about || '';
        this.photoUrl = data.photo_url || '';
        this.photo1Url = data.photo1_url || '';
        this.facebook = data.facebook_link || '';
        this.instagram = data.instagram_link || '';
        this.linkedin = data.linkedin_link || '';
      } catch (e) {
        // Optionally handle error
      }
    },
    async saveSettingsToBackend() {
      try {
        await updateSettings({ ...this.$state });
      } catch (e) {
        // Optionally handle error
      }
    },
    setWebsiteName(name) {
      this.websiteName = name;
    },
    setAddress(address) {
      this.address = address;
    },
    setDistrict(district) {
      this.district = district;
    },
    setPhone(phone) {
      this.phone = phone;
    },
    setEmail(email) {
      this.email = email;
    },
    setAbout(about) {
      this.about = about;
    },
    setPhotoUrl(photoUrl) {
      this.photoUrl = photoUrl;
    },
    setPhoto1Url(photo1Url) {
      this.photo1Url = photo1Url;
    },
    setFacebook(facebook) {
      this.facebook = facebook;
    },
    setInstagram(instagram) {
      this.instagram = instagram;
    },
    setLinkedin(linkedin) {
      this.linkedin = linkedin;
    },
  },
});
