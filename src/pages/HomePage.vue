<!-- src/pages/HomePage.vue-->
<script setup lang="ts">
import { ref } from 'vue';

// Mock stats
const stats = ref([
  { label: 'Total Projects', value: 12, color: 'from-purple-500 to-pink-500' },
  { label: 'Active Bids', value: 5, color: 'from-green-500 to-emerald-500' },
  { label: 'Earnings', value: '$2,450', color: 'from-yellow-500 to-orange-500' }
])

// Mock recent activity
const recentActivity = ref([
  { text: 'You placed a bid on "Landing Page Redesign"', time: '2h ago' },
  { text: 'Your bid was accepted for "Mobile App UI"', time: '5h ago' },
  { text: 'New message from John Doe', time: '1d ago' }
])

</script>

<!-- HomePage.vue -->
<template>
  <div class="p-6 space-y-8">
    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="(stat, index) in stats" :key="index" class="bg-gradient-to-r rounded-xl p-6 shadow-lg text-white"
        :class="stat.color">
        <h3 class="text-lg font-semibold">{{ stat.label }}</h3>
        <p class="text-3xl font-bold mt-2">{{ stat.value }}</p>
      </div>
    </div>
    <!-- Recent Activity -->
    <div>
      <h2 class="text-xl font-semibold mb-4">Recent Activity</h2>
      <div class="bg-gray-400 rounded-xl shadow p-4 space-y-4">
        <div v-for="(item, idx) in recentActivity" :key="idx"
          class="flex justify-between items-center border-b pb-2 last:border-none last:pb-0">
          <span class="text-black font-semibold">{{ item.text }}</span>
          <span class="text-sm text-black">{{ item.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional: Smooth fade-in animation */
div {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>