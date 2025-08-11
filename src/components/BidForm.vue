<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-white">Place Your Bid</h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-white"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Project Info -->
      <div class="bg-gray-700 rounded-lg p-4 mb-6">
        <h3 class="text-lg font-semibold text-white mb-2">{{ project.title }}</h3>
        <p class="text-gray-300 text-sm mb-3">{{ project.description }}</p>
        <div class="flex justify-between items-center">
          <span class="text-purple-400 font-semibold">Budget: ${{ parseFloat(project.budget).toLocaleString() }}</span>
          <span class="text-gray-400 text-sm">{{ formatDate(project.created_at) }}</span>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="amount" class="block text-sm font-medium text-gray-300 mb-2">
            Your Bid Amount (USD) *
          </label>
          <input
            id="amount"
            v-model="form.amount"
            type="number"
            min="1"
            step="0.01"
            required
            class="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter your bid amount"
          />
          <p class="text-sm text-gray-400 mt-1">
            Project budget: ${{ parseFloat(project.budget).toLocaleString() }}
          </p>
        </div>

        <div>
          <label for="cover_letter" class="block text-sm font-medium text-gray-300 mb-2">
            Cover Letter *
          </label>
          <textarea
            id="cover_letter"
            v-model="form.cover_letter"
            rows="6"
            required
            class="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Introduce yourself, explain why you're the best fit for this project, and outline your approach..."
          ></textarea>
        </div>

        <div v-if="error" class="text-red-400 text-sm">
          {{ error }}
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            {{ loading ? 'Submitting...' : 'Submit Bid' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

interface Project {
  id: number
  title: string
  description: string
  budget: string
  created_at: string
}

interface BidForm {
  amount: string
  cover_letter: string
}

const props = defineProps<{
  project: Project
}>()

const emit = defineEmits<{
  close: []
  submitted: [bid: any]
}>()

const form = ref<BidForm>({
  amount: '',
  cover_letter: ''
})

const loading = ref(false)
const error = ref('')

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/bids/', {
      project: props.project.id,
      amount: parseFloat(form.value.amount),
      cover_letter: form.value.cover_letter
    })

    emit('submitted', response.data)
    emit('close')
  } catch (err: any) {
    error.value = err.response?.data?.amount?.[0] || 
                 err.response?.data?.cover_letter?.[0] || 
                 err.response?.data?.project?.[0] || 
                 'Failed to submit bid'
  } finally {
    loading.value = false
  }
}
</script>
