<template>
  <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
    <h2 class="text-2xl font-bold text-white mb-6">Edit Profile</h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Basic Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-300 mb-2">
            Username
          </label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Your username"
          />
        </div>
        
        <div>
          <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="your.email@example.com"
          />
        </div>
      </div>

      <!-- Bio -->
      <div>
        <label for="bio" class="block text-sm font-medium text-gray-300 mb-2">
          Bio
        </label>
        <textarea
          id="bio"
          v-model="form.bio"
          rows="4"
          class="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Tell us about yourself, your experience, and what you're passionate about..."
        ></textarea>
      </div>

      <!-- Skills (for freelancers) -->
      <div v-if="authStore.isFreelancer">
        <label class="block text-sm font-medium text-gray-300 mb-2">
          Skills
        </label>
        <div class="space-y-2">
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in form.skills"
              :key="skill"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-600 text-white"
            >
              {{ skill }}
              <button
                type="button"
                @click="removeSkill(skill)"
                class="ml-2 text-purple-200 hover:text-white"
              >
                ×
              </button>
            </span>
          </div>
          <div class="flex gap-2">
            <input
              v-model="newSkill"
              type="text"
              @keyup.enter="addSkill"
              class="flex-1 px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Add a skill (press Enter)"
            />
            <button
              type="button"
              @click="addSkill"
              class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-300 mb-2">
            Phone Number
          </label>
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            class="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        
        <div>
          <label for="location" class="block text-sm font-medium text-gray-300 mb-2">
            Location
          </label>
          <input
            id="location"
            v-model="form.location"
            type="text"
            class="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="City, Country"
          />
        </div>
      </div>

      <!-- Social Links -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="website" class="block text-sm font-medium text-gray-300 mb-2">
            Website
          </label>
          <input
            id="website"
            v-model="form.website"
            type="url"
            class="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="https://yourwebsite.com"
          />
        </div>
        
        <div>
          <label for="linkedin" class="block text-sm font-medium text-gray-300 mb-2">
            LinkedIn
          </label>
          <input
            id="linkedin"
            v-model="form.linkedin"
            type="url"
            class="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="text-red-400 text-sm">
        {{ error }}
      </div>

      <!-- Success Message -->
      <div v-if="success" class="text-green-400 text-sm">
        {{ success }}
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end">
        <button
          type="submit"
          :disabled="loading"
          class="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
        >
          {{ loading ? 'Saving...' : 'Save Profile' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'

interface ProfileForm {
  username: string
  email: string
  bio: string
  skills: string[]
  phone: string
  location: string
  website: string
  linkedin: string
}

const authStore = useAuthStore()
const form = ref<ProfileForm>({
  username: '',
  email: '',
  bio: '',
  skills: [],
  phone: '',
  location: '',
  website: '',
  linkedin: ''
})

const newSkill = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

// Load current profile data
const loadProfile = async () => {
  try {
    // For now, we'll use the auth store data
    // In a real app, you'd fetch profile data from an API
    form.value.username = authStore.user?.username || ''
    form.value.email = authStore.user?.email || ''
  } catch (err: any) {
    error.value = 'Failed to load profile'
  }
}

// Add skill
const addSkill = () => {
  if (newSkill.value.trim() && !form.value.skills.includes(newSkill.value.trim())) {
    form.value.skills.push(newSkill.value.trim())
    newSkill.value = ''
  }
}

// Remove skill
const removeSkill = (skill: string) => {
  form.value.skills = form.value.skills.filter(s => s !== skill)
}

// Handle form submission
const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    // In a real app, you'd send this to your API
    // For now, we'll simulate a successful update
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    success.value = 'Profile updated successfully!'
    
    // Update the auth store with new username
    if (authStore.user) {
      authStore.user.username = form.value.username
    }
  } catch (err: any) {
    error.value = 'Failed to update profile'
  } finally {
    loading.value = false
  }
}

onMounted(loadProfile)
</script>
