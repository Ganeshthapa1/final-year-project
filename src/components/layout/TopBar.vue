<!-- src/components/TopBar.vue -->
<template>
  <header
    class="flex items-center justify-between bg-white px-6 py-4 border-b border-gray-200"
  >
    <div class="text-lg font-semibold text-gray-900">Dashboard</div>
    <div class="flex items-center space-x-4">
      <LogoutButton />
      <img
        src="https://randomuser.me/api/portraits/men/32.jpg"
        alt="User Avatar"
        class="w-8 h-8 rounded-full object-cover"
      />
    </div>
  </header>
</template>

<script>
import LogoutButton from "../LogoutButton.vue";

export default {
  name: "TopBar",
  components: { LogoutButton },
};
</script>

<style scoped>
/* Existing styles unchanged */
</style>
