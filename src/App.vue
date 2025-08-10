<script setup lang="ts">
import Sidebar from './components/Sidebar.vue';
import MainContent from './components/MainContent.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-r from-black-500 to-gray-500">
    <div class="flex flex-1">
      <Sidebar />
      <MainContent />
    </div>
  </div>
</template>
