<script setup>
import { onMounted } from "vue";
import { useSettingsStore } from "@/stores/settings";
import {
  Calendar,
  User,
  ShoppingCart,
  Settings,
  MessageCircle,
  Package,
  Stethoscope,
  PawPrint,
} from "lucide-vue-next";

const settingsStore = useSettingsStore();

onMounted(() => {
  settingsStore.loadSettings();
});
</script>

<template>
  <nav
    class="h-full flex flex-col bg-white border-r border-gray-200 w-64 px-4 py-6"
  >
    <div class="flex items-center mb-10">
      <div class="text-2xl font-bold text-blue-600 align-center">
        {{ settingsStore.websiteName }}
      </div>
    </div>
    <ul class="flex-1 space-y-4">
      <li>
        <router-link
          to="/admin/"
          class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 router-link-active:bg-blue-100 router-link-active:text-blue-600"
        >
          <Calendar class="w-6 h-6" />
          <span>Dashboard</span>
        </router-link>
      </li>
      <li>
        <router-link
          to="/admin/appointments"
          class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 router-link-active:bg-blue-100 router-link-active:text-blue-600"
        >
          <Calendar class="w-6 h-6" />
          <span>Appointments</span>
        </router-link>
      </li>
      <li>
        <router-link
          to="/admin/inquiries"
          class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 router-link-active:bg-blue-100 router-link-active:text-blue-600"
        >
          <MessageCircle class="w-6 h-6" />
          <span>Inquiries</span>
        </router-link>
      </li>
      <li>
        <router-link
          to="/admin/pets"
          class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 router-link-active:bg-blue-100 router-link-active:text-blue-600"
        >
          <PawPrint class="w-6 h-6" />
          <span>Pets</span>
        </router-link>
      </li>
      <li>
        <router-link
          to="/admin/clients"
          class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 router-link-active:bg-blue-100 router-link-active:text-blue-600"
        >
          <User class="w-6 h-6" />
          <span>Clients</span>
        </router-link>
      </li>
      <li>
        <router-link
          to="/admin/inventory"
          class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 router-link-active:bg-blue-100 router-link-active:text-blue-600"
        >
          <Package class="w-6 h-6" />
          <span>Inventory</span>
        </router-link>
      </li>
      <li>
        <router-link
          to="/admin/doctors"
          class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 router-link-active:bg-blue-100 router-link-active:text-blue-600"
        >
          <Stethoscope class="w-6 h-6" />
          <span>Doctors</span>
        </router-link>
      </li>

      <li>
        <router-link
          to="/admin/settings"
          class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 router-link-active:bg-blue-100 router-link-active:text-blue-600"
        >
          <Settings class="w-6 h-6" />
          <span>Settings</span>
        </router-link>
      </li>
    </ul>
    <div class="mt-auto pt-6"></div>
  </nav>
</template>

<style scoped>
/* Add any specific styles here */
</style>
