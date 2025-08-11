<template>
  <div class="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-all duration-200">
    <div class="flex justify-between items-start mb-4">
      <h3 class="text-xl font-semibold text-white">{{ project.title }}</h3>
      <span :class="getStatusClass(project.status)" class="px-2 py-1 rounded-full text-xs font-medium">
        {{ project.status.replace('_', ' ').toUpperCase() }}
      </span>
    </div>
    
    <p class="text-gray-300 mb-4 line-clamp-3">{{ project.description }}</p>
    
    <div class="flex justify-between items-center mb-4">
      <div class="text-2xl font-bold text-purple-400">
        ${{ parseFloat(project.budget).toLocaleString() }}
      </div>
      <div class="text-sm text-gray-400">
        {{ formatDate(project.created_at) }}
      </div>
    </div>
    
    <div class="flex justify-between items-center">
      <div class="text-sm text-gray-400">
        Posted by {{ project.client_username || 'Unknown' }}
      </div>
      
      <div class="flex space-x-2">
        <button
          @click="$emit('view', project)"
          class="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm"
        >
          View Details
        </button>
        
        <button
          v-if="canBid(project)"
          @click="$emit('bid', project)"
          class="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
        >
          Place Bid
        </button>
        
        <button
          v-if="canEdit(project)"
          @click="$emit('edit', project)"
          class="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
        >
          Edit
        </button>
        
        <button
          v-if="canDelete(project)"
          @click="$emit('delete', project)"
          class="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

interface Project {
  id: number
  title: string
  description: string
  budget: string
  status: string
  created_at: string
  client: number
  client_username?: string
}

const props = defineProps<{
  project: Project
}>()

const emit = defineEmits<{
  view: [project: Project]
  bid: [project: Project]
  edit: [project: Project]
  delete: [project: Project]
}>()

const authStore = useAuthStore()

const getStatusClass = (status: string) => {
  const classes = {
    open: 'bg-green-100 text-green-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const canEdit = (project: Project) => {
  return authStore.isClient && project.client === authStore.user?.id
}

const canDelete = (project: Project) => {
  return authStore.isClient && project.client === authStore.user?.id && project.status === 'open'
}

const canBid = (project: Project) => {
  return authStore.isFreelancer && project.status === 'open'
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
