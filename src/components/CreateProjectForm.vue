<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-white">Create New Project</h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-white"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-300 mb-2">
            Project Title *
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter project title"
          />
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-300 mb-2">
            Project Description *
          </label>
          <textarea
            id="description"
            v-model="form.description"
            rows="4"
            required
            class="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Describe your project requirements, goals, and any specific details..."
          ></textarea>
        </div>

        <div>
          <label for="budget" class="block text-sm font-medium text-gray-300 mb-2">
            Budget (USD) *
          </label>
          <input
            id="budget"
            v-model="form.budget"
            type="number"
            min="1"
            step="0.01"
            required
            class="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter your budget"
          />
        </div>

        <!-- File Attachments -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Project Attachments (Optional)
          </label>
          <FileUpload
            ref="fileUpload"
            accept="image/*,.pdf,.doc,.docx"
            :multiple="true"
            :max-size="5"
            description="Upload project requirements, mockups, or reference materials"
            accept-text="Accepted: Images, PDF, DOC, DOCX (Max 5MB each)"
            @files-selected="handleFilesSelected"
            @files-uploaded="handleFilesUploaded"
          />
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
            {{ loading ? 'Creating...' : 'Create Project' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import FileUpload from './FileUpload.vue'

interface ProjectForm {
  title: string
  description: string
  budget: string
  attachments?: string[]
}

const emit = defineEmits<{
  close: []
  created: [project: any]
}>()

const form = ref<ProjectForm>({
  title: '',
  description: '',
  budget: '',
  attachments: []
})

const loading = ref(false)
const error = ref('')
const fileUpload = ref<InstanceType<typeof FileUpload>>()

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    // Upload files first if any
    if (fileUpload.value) {
      await fileUpload.value.uploadFiles()
    }

    const response = await axios.post('http://127.0.0.1:8000/api/projects/', {
      title: form.value.title,
      description: form.value.description,
      budget: parseFloat(form.value.budget),
      attachments: form.value.attachments
    })

    emit('created', response.data)
    emit('close')
  } catch (err: any) {
    error.value = err.response?.data?.title?.[0] || 
                 err.response?.data?.description?.[0] || 
                 err.response?.data?.budget?.[0] || 
                 'Failed to create project'
  } finally {
    loading.value = false
  }
}

// Handle file selection
const handleFilesSelected = (files: any[]) => {
  console.log('Files selected:', files)
}

// Handle file upload completion
const handleFilesUploaded = (files: any[]) => {
  form.value.attachments = files.map(f => f.url || f.name)
  console.log('Files uploaded:', files)
}
</script>
