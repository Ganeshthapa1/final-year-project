<template>
  <div class="flex h-screen bg-gray-50">
    <SidebarNavigation />
    <div class="flex flex-col flex-1 overflow-hidden">
      <TopBar />
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script>
import SidebarNavigation from '@/components/layout/SidebarNavigation.vue';
import TopBar from '@/components/layout/TopBar.vue';

export default {
  name: 'AdminLayout',
  components: {
    SidebarNavigation,
    TopBar
  }
};
</script>

<style scoped>
/* Add any specific styles here */
</style>
