<template>
  <div class="flex flex-col h-full">
    <!-- Chat Header -->
    <div class="bg-gray-800 px-6 py-4 border-b border-gray-700">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
          <span class="text-white font-semibold">{{ selectedChat?.name?.charAt(0) || 'U' }}</span>
        </div>
        <div>
          <h3 class="text-white font-semibold">{{ selectedChat?.name || 'Select a conversation' }}</h3>
          <p class="text-gray-400 text-sm">{{ selectedChat?.lastMessage || 'No messages yet' }}</p>
        </div>
      </div>
    </div>

    <!-- Messages Area -->
    <div class="flex-1 overflow-y-auto p-6 space-y-4" ref="messagesContainer">
      <div v-if="!selectedChat" class="flex items-center justify-center h-full">
        <div class="text-center">
          <div class="text-gray-400 mb-4">
            <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-white mb-2">No conversation selected</h3>
          <p class="text-gray-400">Choose a conversation from the list to start messaging</p>
        </div>
      </div>
      
      <template v-else>
        <MessageItem
          v-for="message in messages"
          :key="message.id"
          :message="message"
        />
      </template>
    </div>

    <!-- Message Input -->
    <div v-if="selectedChat" class="bg-gray-800 px-6 py-4 border-t border-gray-700">
      <form @submit.prevent="sendMessage" class="flex space-x-3">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Type your message..."
          class="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          :disabled="sending"
        />
        <button
          type="submit"
          :disabled="!newMessage.trim() || sending"
          class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="sending" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import MessageItem from './MessageItem.vue'

interface Chat {
  id: number
  name: string
  lastMessage: string
  unreadCount: number
}

interface Message {
  id: number
  content: string
  sender_id: number
  sender_name: string
  timestamp: string
  status?: 'sent' | 'delivered' | 'read'
}

const props = defineProps<{
  selectedChat: Chat | null
}>()

const emit = defineEmits<{
  messageSent: [message: Message]
}>()

const messages = ref<Message[]>([])
const newMessage = ref('')
const sending = ref(false)
const messagesContainer = ref<HTMLElement>()

// Mock messages for demonstration
const mockMessages: Message[] = [
  {
    id: 1,
    content: "Hi! I'm interested in your project. Can you tell me more about the requirements?",
    sender_id: 2,
    sender_name: "John Doe",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'read'
  },
  {
    id: 2,
    content: "Sure! I need a responsive website with modern design. The budget is around $2000.",
    sender_id: 1,
    sender_name: "You",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    status: 'read'
  },
  {
    id: 3,
    content: "That sounds great! I have experience with modern web technologies. When do you need it completed?",
    sender_id: 2,
    sender_name: "John Doe",
    timestamp: new Date(Date.now() - 900000).toISOString(),
    status: 'delivered'
  }
]

// Load messages when chat is selected
watch(() => props.selectedChat, (chat) => {
  if (chat) {
    // In a real app, you'd fetch messages from API
    messages.value = [...mockMessages]
    scrollToBottom()
  } else {
    messages.value = []
  }
}, { immediate: true })

const sendMessage = async () => {
  if (!newMessage.value.trim() || !props.selectedChat) return
  
  sending.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const message: Message = {
      id: Date.now(),
      content: newMessage.value,
      sender_id: 1, // Current user ID
      sender_name: "You",
      timestamp: new Date().toISOString(),
      status: 'sent'
    }
    
    messages.value.push(message)
    newMessage.value = ''
    
    emit('messageSent', message)
    scrollToBottom()
    
    // Simulate message being delivered
    setTimeout(() => {
      const msg = messages.value.find(m => m.id === message.id)
      if (msg) msg.status = 'delivered'
    }, 1000)
    
  } catch (error) {
    console.error('Failed to send message:', error)
  } finally {
    sending.value = false
  }
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}
</script>
