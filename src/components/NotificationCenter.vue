<template>
  <div class="relative">
    <!-- Notification Bell -->
    <button
      @click="toggleNotifications"
      class="relative p-2 text-gray-300 hover:text-white transition-colors"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 00-6 6v3.75l-2.25 2.25v3h15v-3L15.75 12.75V9.75a6 6 0 00-6-6z"></path>
      </svg>
      
      <!-- Notification Badge -->
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <!-- Notification Panel -->
    <div
      v-if="showNotifications"
      class="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 class="text-lg font-semibold text-white">Notifications</h3>
        <div class="flex items-center space-x-2">
          <button
            @click="markAllAsRead"
            class="text-sm text-purple-400 hover:text-purple-300"
          >
            Mark all read
          </button>
          <button
            @click="toggleNotifications"
            class="text-gray-400 hover:text-white"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Notification List -->
      <div class="max-h-96 overflow-y-auto">
        <div v-if="notifications.length === 0" class="p-6 text-center">
          <div class="text-gray-400 mb-2">
            <svg class="mx-auto h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 00-6 6v3.75l-2.25 2.25v3h15v-3L15.75 12.75V9.75a6 6 0 00-6-6z"></path>
            </svg>
          </div>
          <p class="text-gray-400 text-sm">No notifications yet</p>
        </div>

        <div v-else class="divide-y divide-gray-700">
          <div
            v-for="notification in notifications"
            :key="notification.id"
            :class="[
              'p-4 hover:bg-gray-700/50 transition-colors cursor-pointer',
              !notification.read ? 'bg-purple-900/20' : ''
            ]"
            @click="handleNotificationClick(notification)"
          >
            <div class="flex items-start space-x-3">
              <!-- Notification Icon -->
              <div class="flex-shrink-0">
                <div :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  getNotificationIcon(notification.type).bg
                ]">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getNotificationIcon(notification.type).path"></path>
                  </svg>
                </div>
              </div>

              <!-- Notification Content -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-white">
                  {{ notification.title }}
                </p>
                <p class="text-sm text-gray-400 mt-1">
                  {{ notification.message }}
                </p>
                <div class="flex items-center justify-between mt-2">
                  <span class="text-xs text-gray-500">
                    {{ formatTime(notification.timestamp) }}
                  </span>
                  <div v-if="!notification.read" class="w-2 h-2 bg-purple-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-3 border-t border-gray-700">
        <button
          @click="viewAllNotifications"
          class="w-full text-center text-sm text-purple-400 hover:text-purple-300"
        >
          View all notifications
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Notification {
  id: number
  type: 'bid' | 'project' | 'message' | 'payment' | 'system'
  title: string
  message: string
  timestamp: string
  read: boolean
  data?: any
}

const emit = defineEmits<{
  'notification-click': [notification: Notification]
}>()

const showNotifications = ref(false)
const notifications = ref<Notification[]>([])

// Mock notifications for demonstration
const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'bid',
    title: 'New Bid Received',
    message: 'John Doe placed a bid of $2,500 on your project "E-commerce Website"',
    timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
    read: false,
    data: { projectId: 1, bidId: 1 }
  },
  {
    id: 2,
    type: 'project',
    title: 'Project Status Updated',
    message: 'Your project "Mobile App Development" is now in progress',
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    read: false,
    data: { projectId: 2 }
  },
  {
    id: 3,
    type: 'message',
    title: 'New Message',
    message: 'Sarah Johnson sent you a message about project "Logo Design"',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    read: true,
    data: { conversationId: 1 }
  },
  {
    id: 4,
    type: 'payment',
    title: 'Payment Received',
    message: 'Payment of $1,200 has been received for project "Website Redesign"',
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    read: true,
    data: { projectId: 3, amount: 1200 }
  }
]

// Computed properties
const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

// Methods
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    notification.read = true
  })
}

const handleNotificationClick = (notification: Notification) => {
  notification.read = true
  emit('notification-click', notification)
  
  // Handle navigation based on notification type
  switch (notification.type) {
    case 'bid':
      // Navigate to project bids
      console.log('Navigate to project bids:', notification.data)
      break
    case 'project':
      // Navigate to project details
      console.log('Navigate to project:', notification.data)
      break
    case 'message':
      // Navigate to messages
      console.log('Navigate to messages:', notification.data)
      break
    case 'payment':
      // Navigate to payment history
      console.log('Navigate to payments:', notification.data)
      break
  }
}

const viewAllNotifications = () => {
  // Navigate to full notifications page
  console.log('Navigate to all notifications')
  showNotifications.value = false
}

const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  return date.toLocaleDateString()
}

const getNotificationIcon = (type: string) => {
  const icons = {
    bid: {
      bg: 'bg-blue-500',
      path: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
    },
    project: {
      bg: 'bg-green-500',
      path: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    message: {
      bg: 'bg-purple-500',
      path: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
    },
    payment: {
      bg: 'bg-yellow-500',
      path: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
    },
    system: {
      bg: 'bg-gray-500',
      path: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  }
  
  return icons[type as keyof typeof icons] || icons.system
}

// Add notification
const addNotification = (notification: Omit<Notification, 'id'>) => {
  const newNotification: Notification = {
    ...notification,
    id: Date.now()
  }
  notifications.value.unshift(newNotification)
}

// Simulate real-time notifications
let notificationInterval: NodeJS.Timeout

onMounted(() => {
  // Load initial notifications
  notifications.value = [...mockNotifications]
  
  // Simulate new notifications every 30 seconds
  notificationInterval = setInterval(() => {
    const types = ['bid', 'project', 'message', 'payment'] as const
    const randomType = types[Math.floor(Math.random() * types.length)]
    
    const sampleNotifications = {
      bid: {
        title: 'New Bid Received',
        message: 'A freelancer placed a bid on your project'
      },
      project: {
        title: 'Project Update',
        message: 'Your project status has been updated'
      },
      message: {
        title: 'New Message',
        message: 'You received a new message from a client'
      },
      payment: {
        title: 'Payment Update',
        message: 'A payment has been processed'
      }
    }
    
    addNotification({
      type: randomType,
      title: sampleNotifications[randomType].title,
      message: sampleNotifications[randomType].message,
      timestamp: new Date().toISOString(),
      read: false
    })
  }, 30000) // 30 seconds
})

onUnmounted(() => {
  if (notificationInterval) {
    clearInterval(notificationInterval)
  }
})

// Close notifications when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.notification-center')) {
    showNotifications.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Expose methods
defineExpose({
  addNotification,
  markAllAsRead,
  getUnreadCount: () => unreadCount.value
})
</script>
