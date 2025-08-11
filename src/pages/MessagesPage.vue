<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import ChatInterface from '../components/ChatInterface.vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  unreadCount: number;
  timestamp: string;
  avatar?: string;
}

const authStore = useAuthStore();
const selectedChat = ref<Chat | null>(null);
const searchQuery = ref('');

// Mock conversations data
const conversations = ref<Chat[]>([
  {
    id: 1,
    name: "John Doe",
    lastMessage: "That sounds great! I have experience with modern web technologies.",
    unreadCount: 2,
    timestamp: new Date(Date.now() - 900000).toISOString()
  },
  {
    id: 2,
    name: "Sarah Wilson",
    lastMessage: "When can you start working on the project?",
    unreadCount: 0,
    timestamp: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 3,
    name: "Mike Johnson",
    lastMessage: "Thanks for the detailed proposal!",
    unreadCount: 1,
    timestamp: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 4,
    name: "Emily Brown",
    lastMessage: "I'll review the project requirements and get back to you.",
    unreadCount: 0,
    timestamp: new Date(Date.now() - 86400000).toISOString()
  }
]);

// Filter conversations based on search
const filteredConversations = computed(() => {
  if (!searchQuery.value) return conversations.value;
  
  return conversations.value.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Format timestamp for conversation list
const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
};

// Handle conversation selection
const selectChat = (chat: Chat) => {
  selectedChat.value = chat;
  // Mark messages as read
  chat.unreadCount = 0;
};

// Handle new message sent
const handleMessageSent = (message: any) => {
  if (selectedChat.value) {
    selectedChat.value.lastMessage = message.content;
    selectedChat.value.timestamp = new Date().toISOString();
  }
};
</script>

<template>
  <div class="h-full flex">
    <!-- Conversations Sidebar -->
    <div class="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
      <!-- Header -->
      <div class="p-4 border-b border-gray-700">
        <h1 class="text-xl font-bold text-white mb-4">Messages</h1>
        
        <!-- Search -->
        <div class="relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search conversations..."
            class="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <!-- Conversations List -->
      <div class="flex-1 overflow-y-auto">
        <div
          v-for="chat in filteredConversations"
          :key="chat.id"
          @click="selectChat(chat)"
          :class="[
            'p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors',
            selectedChat?.id === chat.id ? 'bg-gray-700' : ''
          ]"
        >
          <div class="flex items-start space-x-3">
            <!-- Avatar -->
            <div class="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-white font-semibold">{{ chat.name.charAt(0) }}</span>
            </div>
            
            <!-- Chat Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <h3 class="text-white font-semibold truncate">{{ chat.name }}</h3>
                <span class="text-xs text-gray-400">{{ formatTimestamp(chat.timestamp) }}</span>
              </div>
              
              <p class="text-gray-300 text-sm truncate">{{ chat.lastMessage }}</p>
              
              <!-- Unread Badge -->
              <div v-if="chat.unreadCount > 0" class="flex justify-between items-center mt-1">
                <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span class="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                  {{ chat.unreadCount }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="filteredConversations.length === 0" class="p-8 text-center">
          <div class="text-gray-400 mb-4">
            <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-white mb-2">No conversations found</h3>
          <p class="text-gray-400">
            {{ searchQuery ? 'Try adjusting your search' : 'Start a conversation to see messages here' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Chat Interface -->
    <div class="flex-1 flex flex-col">
      <ChatInterface
        :selected-chat="selectedChat"
        @message-sent="handleMessageSent"
      />
    </div>
  </div>
</template>
