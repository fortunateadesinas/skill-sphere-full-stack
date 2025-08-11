<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from './stores/auth';
import Sidebar from './components/Sidebar.vue';

const route = useRoute();
const authStore = useAuthStore();

// Check if current route is an auth page (login/register)
const isAuthPage = computed(() => {
  return route.name === 'Login' || route.name === 'Register';
});

// Show sidebar only if authenticated and not on auth pages
const showSidebar = computed(() => {
  return authStore.isAuthenticated && !isAuthPage.value;
});
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-r from-black-500 to-gray-500">
    <div class="flex flex-1">
      <Sidebar v-if="showSidebar" />
      <div :class="[
        'flex-1 overflow-auto',
        showSidebar ? 'ml-20' : ''
      ]">
        <RouterView />
      </div>
    </div>
  </div>
</template>
