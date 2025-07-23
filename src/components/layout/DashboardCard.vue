<script>
export default {
  name: 'DashboardCard',
  props: {
    title: { type: String, required: true },
    mainValue: { type: [String, Number], required: true },
    change: { type: Number, default: 0 },
    subValues: { type: Object, default: null },
    highlighted: { type: Boolean, default: false },
    showDropdown: { type: Boolean, default: true },
    dropdownOptions: { type: Array, default: () => ['This Week', 'Last Week', 'This Month'] }
  }
}
</script>

<template>
  <div 
    :class="['rounded-lg p-4 shadow-sm', highlighted ? 'bg-blue-600 text-white' : 'bg-white text-gray-900']"
  >
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center space-x-2">
        <slot name="icon"></slot>
        <h3 class="text-sm font-semibold">{{ title }}</h3>
      </div>
      <select v-if="showDropdown" class="text-xs bg-transparent border-none text-current cursor-pointer">
        <option v-for="option in dropdownOptions" :key="option" :value="option">{{ option }}</option>
      </select>
    </div>
    <div class="flex justify-between items-center">
      <div class="text-2xl font-bold">{{ mainValue }}</div>
      <div :class="['text-sm font-semibold', change >= 0 ? 'text-green-500' : 'text-red-500']">
        {{ change >= 0 ? '+' : '' }}{{ change }}%
      </div>
    </div>
    <div v-if="subValues" class="flex justify-between mt-2 text-xs opacity-75">
      <div v-for="(value, key) in subValues" :key="key" class="flex flex-col items-center">
        <span>{{ key }}</span>
        <span>{{ value }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any specific styles here */
</style>
