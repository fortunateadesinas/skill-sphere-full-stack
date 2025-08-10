<script setup lang="ts">
import { ref } from 'vue';
import { HomeIcon, BriefcaseIcon, UserIcon, FolderIcon, InboxIcon } from '@heroicons/vue/24/outline';

const isCollapsed = ref(false);

const navItems = [
  { name: 'Home', icon: HomeIcon },
  { name: 'Projects', icon: FolderIcon },
  { name: 'My Bids', icon: BriefcaseIcon },
  { name: 'Messages', icon: InboxIcon},
  { name: 'Profile', icon: UserIcon },
];

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value;
}
</script>

<template>
  <div
    :class="[
      'min-h-screen  bg-white/30 backdrop-blur-lg shadow-xl text-white flex flex-col transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-56'
    ]"
  >
    <!-- Logo Section -->
    <div class="flex items-center justify-center p-4 border-b border-gray-700">
      <img
        src="../assets/logo.png"
        alt="Logo"
        class="w-8 h-8"
      />
    </div>

    <!-- Navigation -->
    <nav class="flex-1 flex flex-col mt-4 space-y-1">
      <div
        v-for="item in navItems"
        :key="item.name"
        :class="[
          'flex items-center hover:bg-gray-600 cursor-pointer transition-all',
          isCollapsed ? 'justify-center py-3' : 'px-4 py-3 space-x-3'
        ]"
      >
        <component :is="item.icon" class="h-6 w-6" />
        <span v-if="!isCollapsed">{{ item.name }}</span>
      </div>
    </nav>

    <!-- Toggle Button -->
    <div class="p-4 border-t border-gray-700">
      <button
        @click="toggleSidebar"
        class="w-full flex items-center justify-center bg-gray-600 hover:bg-gray-800 rounded p-2"
      >
        {{ isCollapsed ? '→' : '←' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Smooth width animation */
div {
  transition: width 0.3s ease;
}
</style>
