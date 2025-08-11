<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
    <div class="max-w-md w-full space-y-8 p-8">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-white">
          Sign in to your account
        </h2>
        <p class="mt-2 text-sm text-gray-300">
          Welcome back to SkillSphere
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              id="username"
              v-model="form.username"
              name="username"
              type="text"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
              placeholder="Enter your username"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <div v-if="authStore.error" class="text-red-400 text-sm text-center">
          {{ authStore.error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="authStore.loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="authStore.loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ authStore.loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-300">
            Don't have an account?
            <router-link to="/register" class="font-medium text-purple-400 hover:text-purple-300">
              Sign up here
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  username: '',
  password: ''
})

const handleLogin = async () => {
  try {
    await authStore.login(form.value)
    router.push('/')
  } catch (error) {
    // Error is handled by the store
    console.error('Login failed:', error)
  }
}
</script>
