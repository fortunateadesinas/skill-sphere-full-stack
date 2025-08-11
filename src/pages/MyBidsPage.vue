<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import axios from 'axios';

interface Bid {
  id: number;
  project: {
    id: number;
    title: string;
    description: string;
    budget: string;
    status: string;
    created_at: string;
  };
  amount: string;
  cover_letter: string;
  created_at: string;
}

const authStore = useAuthStore();
const bids = ref<Bid[]>([]);
const loading = ref(true);
const error = ref('');

async function fetchBids() {
  loading.value = true;
  error.value = '';

  try {
    const response = await axios.get('http://127.0.0.1:8000/api/bids/');
    bids.value = response.data;
  } catch (err: any) {
    error.value = err.response?.data?.detail || 'Failed to fetch bids';
  } finally {
    loading.value = false;
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusClass = (status: string) => {
  const classes = {
    open: 'bg-green-100 text-green-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
};

onMounted(fetchBids);
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-white">My Bids</h1>
      <p class="text-gray-400 mt-1">Track all the bids you've placed on projects</p>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
      {{ error }}
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
    </div>

    <!-- Bids List -->
    <div v-else-if="bids.length > 0" class="space-y-6">
      <div
        v-for="bid in bids"
        :key="bid.id"
        class="bg-gray-800 rounded-lg p-6 border border-gray-700"
      >
        <!-- Project Info -->
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <h3 class="text-xl font-semibold text-white mb-2">{{ bid.project.title }}</h3>
            <p class="text-gray-300 text-sm mb-3 line-clamp-2">{{ bid.project.description }}</p>
          </div>
          <span :class="getStatusClass(bid.project.status)" class="px-2 py-1 rounded-full text-xs font-medium ml-4">
            {{ bid.project.status.replace('_', ' ').toUpperCase() }}
          </span>
        </div>

        <!-- Bid Details -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <span class="text-gray-400 text-sm">Your Bid:</span>
            <div class="text-2xl font-bold text-purple-400">${{ parseFloat(bid.amount).toLocaleString() }}</div>
          </div>
          <div>
            <span class="text-gray-400 text-sm">Project Budget:</span>
            <div class="text-lg text-white">${{ parseFloat(bid.project.budget).toLocaleString() }}</div>
          </div>
          <div>
            <span class="text-gray-400 text-sm">Bid Placed:</span>
            <div class="text-sm text-white">{{ formatDate(bid.created_at) }}</div>
          </div>
        </div>

        <!-- Cover Letter -->
        <div class="bg-gray-700 rounded-lg p-4">
          <h4 class="text-sm font-medium text-gray-300 mb-2">Your Cover Letter:</h4>
          <p class="text-gray-300 text-sm">{{ bid.cover_letter }}</p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-white mb-2">No bids yet</h3>
      <p class="text-gray-400 mb-4">Start bidding on projects to see them here</p>
      <router-link
        to="/projects"
        class="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
      >
        Browse Projects
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
