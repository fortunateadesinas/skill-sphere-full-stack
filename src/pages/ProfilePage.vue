<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import ProfileForm from '../components/ProfileForm.vue';
import Portfolio from '../components/Portfolio.vue';
import { UserIcon, PencilIcon, StarIcon, MapPinIcon, GlobeAltIcon, PhoneIcon } from '@heroicons/vue/24/outline';

const authStore = useAuthStore();
const showEditForm = ref(false);

// Mock profile data - in a real app, this would come from an API
const profile = ref({
  bio: 'Passionate developer with 5+ years of experience in web development. I love creating beautiful, functional applications that solve real-world problems.',
  skills: ['JavaScript', 'Vue.js', 'React', 'Node.js', 'Python', 'Django'],
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  website: 'https://johndoe.dev',
  linkedin: 'https://linkedin.com/in/johndoe',
  rating: 4.8,
  completedProjects: 24,
  totalEarnings: 15420
});

const isFreelancer = computed(() => authStore.isFreelancer);
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-white">Profile</h1>
        <p class="text-gray-400 mt-1">Manage your account and profile information</p>
      </div>
      
      <button
        @click="showEditForm = !showEditForm"
        class="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
      >
        <PencilIcon class="w-5 h-5" />
        <span>{{ showEditForm ? 'Cancel Edit' : 'Edit Profile' }}</span>
      </button>
    </div>

    <!-- Edit Form -->
    <ProfileForm v-if="showEditForm" />

    <!-- Profile View -->
    <div v-else class="space-y-6">
      <!-- Basic Info Card -->
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div class="flex items-start space-x-6">
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <div class="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center">
              <UserIcon class="w-12 h-12 text-white" />
            </div>
          </div>
          
          <!-- User Info -->
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-2">
              <h2 class="text-2xl font-bold text-white">{{ authStore.user?.username }}</h2>
              <span class="px-2 py-1 bg-purple-600 text-white text-sm rounded-full capitalize">
                {{ authStore.user?.role }}
              </span>
            </div>
            
            <p class="text-gray-300 mb-4">{{ profile.bio }}</p>
            
            <!-- Stats (for freelancers) -->
            <div v-if="isFreelancer" class="grid grid-cols-3 gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-purple-400">{{ profile.rating }}</div>
                <div class="text-sm text-gray-400">Rating</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-purple-400">{{ profile.completedProjects }}</div>
                <div class="text-sm text-gray-400">Projects</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-purple-400">${{ profile.totalEarnings.toLocaleString() }}</div>
                <div class="text-sm text-gray-400">Earnings</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Skills (for freelancers) -->
      <div v-if="isFreelancer" class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 class="text-xl font-semibold text-white mb-4">Skills</h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="skill in profile.skills"
            :key="skill"
            class="px-3 py-1 bg-purple-600 text-white rounded-full text-sm"
          >
            {{ skill }}
          </span>
        </div>
      </div>

      <!-- Portfolio (for freelancers) -->
      <div v-if="isFreelancer">
        <Portfolio />
      </div>

      <!-- Contact Information -->
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 class="text-xl font-semibold text-white mb-4">Contact Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-center space-x-3">
            <PhoneIcon class="w-5 h-5 text-gray-400" />
            <span class="text-gray-300">{{ profile.phone }}</span>
          </div>
          <div class="flex items-center space-x-3">
            <MapPinIcon class="w-5 h-5 text-gray-400" />
            <span class="text-gray-300">{{ profile.location }}</span>
          </div>
          <div class="flex items-center space-x-3">
            <GlobeAltIcon class="w-5 h-5 text-gray-400" />
            <a :href="profile.website" target="_blank" class="text-purple-400 hover:text-purple-300">
              {{ profile.website }}
            </a>
          </div>
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <a :href="profile.linkedin" target="_blank" class="text-purple-400 hover:text-purple-300">
              LinkedIn Profile
            </a>
          </div>
        </div>
      </div>

      <!-- Account Settings -->
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 class="text-xl font-semibold text-white mb-4">Account Settings</h3>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <div>
              <h4 class="text-white font-medium">Email</h4>
              <p class="text-gray-400">{{ authStore.user?.email || 'No email set' }}</p>
            </div>
            <button class="text-purple-400 hover:text-purple-300 text-sm">
              Change
            </button>
          </div>
          
          <div class="flex justify-between items-center">
            <div>
              <h4 class="text-white font-medium">Password</h4>
              <p class="text-gray-400">Last changed 30 days ago</p>
            </div>
            <button class="text-purple-400 hover:text-purple-300 text-sm">
              Change
            </button>
          </div>
          
          <div class="flex justify-between items-center">
            <div>
              <h4 class="text-white font-medium">Two-Factor Authentication</h4>
              <p class="text-gray-400">Not enabled</p>
            </div>
            <button class="text-purple-400 hover:text-purple-300 text-sm">
              Enable
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
