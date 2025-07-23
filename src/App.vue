<template>
  <div id="app">
    <!-- Navigation -->
    <AppNavigation v-if="!isAdminRoute" />

    <!-- Main Content -->
    <main :class="isAdminRoute ? '' : 'pt-16'">
      <router-view />
    </main>

    <!-- Footer -->
    <AppFooter v-if="!isAdminRoute" />

    <!-- Success Modal -->
    <SuccessModal 
      v-if="uiStore.showSuccessModal"
      :title="uiStore.successMessage.title"
      :message="uiStore.successMessage.message"
      @close="uiStore.hideSuccessModal"
    />
  </div>
</template>

<script>
import AppNavigation from '@/components/layout/AppNavigation.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import SuccessModal from '@/components/ui/SuccessModal.vue'
import { useUIStore } from '@/stores/ui'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'App',
  components: {
    AppNavigation,
    AppFooter,
    SuccessModal
  },
  setup() {
    const uiStore = useUIStore()
    const route = useRoute()
    
    const isAdminRoute = computed(() => {
      return route.meta.isAdmin === true
    })
    
    return {
      uiStore,
      isAdminRoute
    }
  }
}
</script>
