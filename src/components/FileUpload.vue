<template>
  <div class="w-full">
    <!-- File Upload Area -->
    <div
      @drop.prevent="handleDrop"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @click="triggerFileInput"
      :class="[
        'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200',
        isDragging 
          ? 'border-purple-500 bg-purple-50/10' 
          : 'border-gray-600 hover:border-purple-500 hover:bg-gray-700/50'
      ]"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        :multiple="multiple"
        @change="handleFileSelect"
        class="hidden"
      />
      
      <div class="space-y-3">
        <!-- Upload Icon -->
        <div class="mx-auto w-12 h-12 text-gray-400">
          <svg v-if="!isDragging" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24" class="text-purple-500">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
        </div>
        
        <!-- Upload Text -->
        <div>
          <p class="text-lg font-medium text-white">
            {{ isDragging ? 'Drop files here' : 'Upload files' }}
          </p>
          <p class="text-sm text-gray-400 mt-1">
            {{ description || `Drag and drop files here, or click to select files` }}
          </p>
          <p class="text-xs text-gray-500 mt-1">
            {{ acceptText || 'Accepted formats: JPG, PNG, PDF, DOC, DOCX (Max 10MB each)' }}
          </p>
        </div>
      </div>
    </div>

    <!-- File List -->
    <div v-if="files.length > 0" class="mt-4 space-y-2">
      <h4 class="text-sm font-medium text-white">Selected Files:</h4>
      <div class="space-y-2">
        <div
          v-for="(file, index) in files"
          :key="index"
          class="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700"
        >
          <!-- File Info -->
          <div class="flex items-center space-x-3">
            <!-- File Icon -->
            <div class="w-8 h-8 flex items-center justify-center">
              <svg v-if="isImageFile(file)" class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <svg v-else class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            
            <!-- File Details -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-white truncate">{{ file.name }}</p>
              <p class="text-xs text-gray-400">{{ formatFileSize(file.size) }}</p>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex items-center space-x-2">
            <!-- Upload Progress -->
            <div v-if="file.uploading" class="flex items-center space-x-2">
              <div class="w-4 h-4 border-2 border-gray-600 border-t-purple-500 rounded-full animate-spin"></div>
              <span class="text-xs text-gray-400">Uploading...</span>
            </div>
            
            <!-- Upload Status -->
            <div v-else-if="file.uploaded" class="flex items-center space-x-2">
              <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span class="text-xs text-green-400">Uploaded</span>
            </div>
            
            <!-- Remove Button -->
            <button
              @click="removeFile(index)"
              class="text-red-400 hover:text-red-300 transition-colors"
              :disabled="file.uploading"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mt-3 text-red-400 text-sm">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface FileWithStatus extends File {
  uploading?: boolean
  uploaded?: boolean
  url?: string
}

interface Props {
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
  description?: string
  acceptText?: string
  autoUpload?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'image/*,.pdf,.doc,.docx',
  multiple: true,
  maxSize: 10,
  autoUpload: false
})

const emit = defineEmits<{
  'files-selected': [files: FileWithStatus[]]
  'files-uploaded': [files: FileWithStatus[]]
  'file-removed': [index: number]
}>()

const fileInput = ref<HTMLInputElement>()
const files = ref<FileWithStatus[]>([])
const isDragging = ref(false)
const error = ref('')

// File validation
const validateFile = (file: File): string | null => {
  // Check file size
  if (file.size > props.maxSize * 1024 * 1024) {
    return `File ${file.name} is too large. Maximum size is ${props.maxSize}MB.`
  }
  
  // Check file type (basic validation)
  const acceptedTypes = props.accept.split(',')
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
  const fileType = file.type
  
  const isAccepted = acceptedTypes.some(type => {
    if (type.includes('*')) {
      return fileType.startsWith(type.replace('*', ''))
    }
    return type.toLowerCase() === fileExtension || type.toLowerCase() === fileType
  })
  
  if (!isAccepted) {
    return `File type not supported. Accepted types: ${props.accept}`
  }
  
  return null
}

// Handle file selection
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    addFiles(Array.from(target.files))
  }
}

// Handle drag and drop
const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files))
  }
}

// Add files to the list
const addFiles = (newFiles: File[]) => {
  error.value = ''
  
  for (const file of newFiles) {
    const validationError = validateFile(file)
    if (validationError) {
      error.value = validationError
      continue
    }
    
    const fileWithStatus: FileWithStatus = file
    files.value.push(fileWithStatus)
  }
  
  emit('files-selected', files.value)
  
  // Auto upload if enabled
  if (props.autoUpload) {
    uploadFiles()
  }
}

// Remove file
const removeFile = (index: number) => {
  const removedFile = files.value[index]
  files.value.splice(index, 1)
  emit('file-removed', index)
}

// Upload files
const uploadFiles = async () => {
  const filesToUpload = files.value.filter(f => !f.uploaded && !f.uploading)
  
  for (const file of filesToUpload) {
    file.uploading = true
    
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
      
      // In a real app, you'd upload to your server here
      // const formData = new FormData()
      // formData.append('file', file)
      // const response = await axios.post('/api/upload/', formData)
      // file.url = response.data.url
      
      file.uploaded = true
      file.uploading = false
    } catch (err) {
      file.uploading = false
      error.value = `Failed to upload ${file.name}`
    }
  }
  
  emit('files-uploaded', files.value.filter(f => f.uploaded))
}

// Utility functions
const triggerFileInput = () => {
  fileInput.value?.click()
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/')
}

// Expose methods
defineExpose({
  uploadFiles,
  clearFiles: () => {
    files.value = []
    error.value = ''
  }
})
</script>
