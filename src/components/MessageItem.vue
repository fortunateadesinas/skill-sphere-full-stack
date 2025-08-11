<template>
  <div :class="[
    'flex mb-4',
    isOwnMessage ? 'justify-end' : 'justify-start'
  ]">
    <div :class="[
      'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
      isOwnMessage 
        ? 'bg-purple-600 text-white' 
        : 'bg-gray-700 text-gray-200'
    ]">
      <!-- Message Header -->
      <div class="flex items-center justify-between mb-1">
        <span class="text-sm font-medium">
          {{ message.sender_name }}
        </span>
        <span class="text-xs opacity-75">
          {{ formatTime(message.timestamp) }}
        </span>
      </div>
      
      <!-- Message Content -->
      <p class="text-sm">{{ message.content }}</p>
      
      <!-- Message Status (for own messages) -->
      <div v-if="isOwnMessage" class="flex justify-end mt-1">
        <span class="text-xs opacity-75">
          {{ getMessageStatus(message.status) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

interface Message {
  id: number
  content: string
  sender_id: number
  sender_name: string
  timestamp: string
  status?: 'sent' | 'delivered' | 'read'
}

const props = defineProps<{
  message: Message
}>()

const authStore = useAuthStore()

const isOwnMessage = computed(() => {
  return props.message.sender_id === authStore.user?.id
})

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  
  if (diffInHours < 24) {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

const getMessageStatus = (status?: string) => {
  switch (status) {
    case 'sent':
      return '✓'
    case 'delivered':
      return '✓✓'
    case 'read':
      return '✓✓'
    default:
      return '✓'
  }
}
</script>
