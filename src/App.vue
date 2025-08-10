<script setup lang="ts">
import Sidebar from './components/Sidebar.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-r from-black-500 to-gray-500">
    <div class="flex flex-1">
      <Sidebar />
      <div class="flex-1 overflow-auto">
        <RouterView />
      </div>
    </div>
  </div>
</template>
