<template>
  <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-white">Portfolio</h2>
      <button
        @click="showAddProject = true"
        class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
      >
        Add Project
      </button>
    </div>

    <!-- Portfolio Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-gray-700 rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-white">{{ portfolioStats.totalProjects }}</div>
        <div class="text-sm text-gray-400">Total Projects</div>
      </div>
      <div class="bg-gray-700 rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-white">{{ portfolioStats.completedProjects }}</div>
        <div class="text-sm text-gray-400">Completed</div>
      </div>
      <div class="bg-gray-700 rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-white">{{ portfolioStats.totalEarnings }}</div>
        <div class="text-sm text-gray-400">Total Earnings</div>
      </div>
      <div class="bg-gray-700 rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-white">{{ portfolioStats.avgRating }}</div>
        <div class="text-sm text-gray-400">Avg Rating</div>
      </div>
    </div>

    <!-- Portfolio Projects -->
    <div class="space-y-6">
      <div
        v-for="project in portfolioProjects"
        :key="project.id"
        class="bg-gray-700 rounded-lg p-6 border border-gray-600"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <h3 class="text-xl font-semibold text-white mb-2">{{ project.title }}</h3>
            <p class="text-gray-300 mb-3">{{ project.description }}</p>
            
            <!-- Project Details -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <span class="text-sm text-gray-400">Budget:</span>
                <div class="text-white font-medium">${{ project.budget }}</div>
              </div>
              <div>
                <span class="text-sm text-gray-400">Duration:</span>
                <div class="text-white font-medium">{{ project.duration }}</div>
              </div>
              <div>
                <span class="text-sm text-gray-400">Status:</span>
                <div class="text-white font-medium">{{ project.status }}</div>
              </div>
              <div>
                <span class="text-sm text-gray-400">Rating:</span>
                <div class="flex items-center">
                  <div class="flex text-yellow-400">
                    <svg
                      v-for="star in 5"
                      :key="star"
                      class="w-4 h-4"
                      :class="star <= project.rating ? 'text-yellow-400' : 'text-gray-600'"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                  <span class="text-white ml-1">({{ project.rating }})</span>
                </div>
              </div>
            </div>

            <!-- Technologies Used -->
            <div class="mb-4">
              <span class="text-sm text-gray-400">Technologies:</span>
              <div class="flex flex-wrap gap-2 mt-1">
                <span
                  v-for="tech in project.technologies"
                  :key="tech"
                  class="px-2 py-1 bg-purple-600 text-white text-xs rounded-full"
                >
                  {{ tech }}
                </span>
              </div>
            </div>

            <!-- Project Images -->
            <div v-if="project.images && project.images.length > 0" class="mb-4">
              <span class="text-sm text-gray-400">Screenshots:</span>
              <div class="flex space-x-2 mt-2 overflow-x-auto">
                <img
                  v-for="(image, index) in project.images"
                  :key="index"
                  :src="image"
                  :alt="`${project.title} screenshot ${index + 1}`"
                  class="w-20 h-20 object-cover rounded-lg border border-gray-600"
                  @click="viewImage(image)"
                />
              </div>
            </div>

            <!-- Client Feedback -->
            <div v-if="project.clientFeedback" class="bg-gray-600 rounded-lg p-4">
              <span class="text-sm text-gray-400">Client Feedback:</span>
              <p class="text-white mt-1 italic">"{{ project.clientFeedback }}"</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col space-y-2 ml-4">
            <button
              @click="editProject(project)"
              class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Edit
            </button>
            <button
              @click="deleteProject(project.id)"
              class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Project Modal -->
    <div v-if="showAddProject" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold text-white mb-4">Add Portfolio Project</h3>
        
        <form @submit.prevent="addProject" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Project Title</label>
            <input
              v-model="newProject.title"
              type="text"
              required
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              v-model="newProject.description"
              rows="3"
              required
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Budget</label>
              <input
                v-model="newProject.budget"
                type="number"
                required
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Duration</label>
              <input
                v-model="newProject.duration"
                type="text"
                placeholder="e.g., 2 weeks"
                required
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Technologies (comma-separated)</label>
            <input
              v-model="newProject.technologies"
              type="text"
              placeholder="React, Node.js, MongoDB"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Client Feedback (optional)</label>
            <textarea
              v-model="newProject.clientFeedback"
              rows="2"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            ></textarea>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="showAddProject = false"
              class="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Image Viewer Modal -->
    <div v-if="selectedImage" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div class="relative max-w-4xl max-h-[90vh]">
        <img
          :src="selectedImage"
          alt="Portfolio project"
          class="max-w-full max-h-full object-contain"
        />
        <button
          @click="selectedImage = null"
          class="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface PortfolioProject {
  id: number
  title: string
  description: string
  budget: number
  duration: string
  status: string
  rating: number
  technologies: string[]
  images?: string[]
  clientFeedback?: string
}

const showAddProject = ref(false)
const selectedImage = ref<string | null>(null)

// Mock portfolio data
const portfolioProjects = ref<PortfolioProject[]>([
  {
    id: 1,
    title: 'E-commerce Website',
    description: 'A full-stack e-commerce platform with payment integration and admin dashboard.',
    budget: 2500,
    duration: '3 weeks',
    status: 'Completed',
    rating: 5,
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    images: [
      'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=E-commerce+Home',
      'https://via.placeholder.com/300x200/10B981/FFFFFF?text=Product+Page',
      'https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Admin+Dashboard'
    ],
    clientFeedback: 'Excellent work! The website exceeded our expectations and was delivered on time.'
  },
  {
    id: 2,
    title: 'Mobile App Development',
    description: 'Cross-platform mobile app for task management with real-time synchronization.',
    budget: 1800,
    duration: '4 weeks',
    status: 'Completed',
    rating: 4,
    technologies: ['React Native', 'Firebase', 'Redux'],
    images: [
      'https://via.placeholder.com/300x200/EF4444/FFFFFF?text=Mobile+App+Home',
      'https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Task+List'
    ],
    clientFeedback: 'Great communication throughout the project. The app works perfectly!'
  },
  {
    id: 3,
    title: 'Logo Design & Branding',
    description: 'Complete brand identity design including logo, color palette, and style guide.',
    budget: 800,
    duration: '1 week',
    status: 'Completed',
    rating: 5,
    technologies: ['Adobe Illustrator', 'Photoshop', 'Figma'],
    images: [
      'https://via.placeholder.com/300x200/06B6D4/FFFFFF?text=Logo+Design'
    ],
    clientFeedback: 'Beautiful and professional design that perfectly represents our brand.'
  }
])

// New project form
const newProject = ref({
  title: '',
  description: '',
  budget: '',
  duration: '',
  technologies: '',
  clientFeedback: ''
})

// Computed stats
const portfolioStats = computed(() => {
  const totalProjects = portfolioProjects.value.length
  const completedProjects = portfolioProjects.value.filter(p => p.status === 'Completed').length
  const totalEarnings = portfolioProjects.value.reduce((sum, p) => sum + p.budget, 0)
  const avgRating = portfolioProjects.value.length > 0 
    ? (portfolioProjects.value.reduce((sum, p) => sum + p.rating, 0) / portfolioProjects.value.length).toFixed(1)
    : '0.0'

  return {
    totalProjects,
    completedProjects,
    totalEarnings: `$${totalEarnings.toLocaleString()}`,
    avgRating
  }
})

// Methods
const addProject = () => {
  const project: PortfolioProject = {
    id: Date.now(),
    title: newProject.value.title,
    description: newProject.value.description,
    budget: parseFloat(newProject.value.budget),
    duration: newProject.value.duration,
    status: 'Completed',
    rating: 5,
    technologies: newProject.value.technologies.split(',').map(t => t.trim()).filter(t => t),
    clientFeedback: newProject.value.clientFeedback || undefined
  }

  portfolioProjects.value.unshift(project)
  
  // Reset form
  Object.assign(newProject.value, {
    title: '',
    description: '',
    budget: '',
    duration: '',
    technologies: '',
    clientFeedback: ''
  })
  
  showAddProject.value = false
}

const editProject = (project: PortfolioProject) => {
  // In a real app, you'd open an edit modal
  console.log('Edit project:', project)
}

const deleteProject = (projectId: number) => {
  if (confirm('Are you sure you want to delete this project?')) {
    portfolioProjects.value = portfolioProjects.value.filter(p => p.id !== projectId)
  }
}

const viewImage = (imageUrl: string) => {
  selectedImage.value = imageUrl
}
</script>
