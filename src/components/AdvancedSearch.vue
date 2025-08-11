<template>
  <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-white">Advanced Search</h3>
      <button
        @click="toggleAdvanced"
        class="text-purple-400 hover:text-purple-300 text-sm flex items-center space-x-1"
      >
        <span>{{ showAdvanced ? 'Hide' : 'Show' }} Advanced</span>
        <svg 
          class="w-4 h-4 transition-transform" 
          :class="{ 'rotate-180': showAdvanced }"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
    </div>

    <!-- Basic Search -->
    <div class="space-y-4">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search projects..."
          class="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          @input="handleSearch"
        />
        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>

      <!-- Advanced Filters -->
      <div v-if="showAdvanced" class="space-y-4 pt-4 border-t border-gray-700">
        <!-- Budget Range -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Budget Range</label>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <input
                v-model="filters.minBudget"
                type="number"
                placeholder="Min"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                @input="handleSearch"
              />
            </div>
            <div>
              <input
                v-model="filters.maxBudget"
                type="number"
                placeholder="Max"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                @input="handleSearch"
              />
            </div>
          </div>
        </div>

        <!-- Project Status -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Project Status</label>
          <div class="grid grid-cols-2 gap-2">
            <label v-for="status in projectStatuses" :key="status.value" class="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                :value="status.value"
                v-model="filters.status"
                @change="handleSearch"
                class="rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-gray-700"
              />
              <span class="text-sm text-gray-300">{{ status.label }}</span>
            </label>
          </div>
        </div>

        <!-- Skills Required -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Required Skills</label>
          <div class="space-y-2">
            <div class="flex flex-wrap gap-2">
              <span
                v-for="skill in selectedSkills"
                :key="skill"
                class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-600 text-white"
              >
                {{ skill }}
                <button
                  @click="removeSkill(skill)"
                  class="ml-1 text-purple-200 hover:text-white"
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
                placeholder="Add skill"
                class="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                @click="addSkill"
                class="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <!-- Location -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Location</label>
          <select
            v-model="filters.location"
            @change="handleSearch"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Any Location</option>
            <option value="remote">Remote Only</option>
            <option value="onsite">On-site Only</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        <!-- Project Duration -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Project Duration</label>
          <select
            v-model="filters.duration"
            @change="handleSearch"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Any Duration</option>
            <option value="1-2_weeks">1-2 weeks</option>
            <option value="1-3_months">1-3 months</option>
            <option value="3-6_months">3-6 months</option>
            <option value="6+_months">6+ months</option>
          </select>
        </div>

        <!-- Sort Options -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
          <select
            v-model="filters.sortBy"
            @change="handleSearch"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="budget_high">Highest Budget</option>
            <option value="budget_low">Lowest Budget</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex space-x-3 pt-4">
        <button
          @click="clearFilters"
          class="flex-1 px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
        >
          Clear Filters
        </button>
        <button
          @click="applyFilters"
          class="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

interface SearchFilters {
  minBudget: string
  maxBudget: string
  status: string[]
  location: string
  duration: string
  sortBy: string
}

const emit = defineEmits<{
  'search': [query: string, filters: SearchFilters]
  'filters-changed': [filters: SearchFilters]
}>()

const showAdvanced = ref(false)
const searchQuery = ref('')
const newSkill = ref('')
const selectedSkills = ref<string[]>([])

const filters = reactive<SearchFilters>({
  minBudget: '',
  maxBudget: '',
  status: [],
  location: '',
  duration: '',
  sortBy: 'newest'
})

const projectStatuses = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' }
]

// Toggle advanced search
const toggleAdvanced = () => {
  showAdvanced.value = !showAdvanced.value
}

// Handle search input
const handleSearch = () => {
  emit('search', searchQuery.value, filters)
}

// Add skill
const addSkill = () => {
  if (newSkill.value.trim() && !selectedSkills.value.includes(newSkill.value.trim())) {
    selectedSkills.value.push(newSkill.value.trim())
    newSkill.value = ''
    handleSearch()
  }
}

// Remove skill
const removeSkill = (skill: string) => {
  selectedSkills.value = selectedSkills.value.filter(s => s !== skill)
  handleSearch()
}

// Apply filters
const applyFilters = () => {
  emit('filters-changed', filters)
}

// Clear all filters
const clearFilters = () => {
  searchQuery.value = ''
  newSkill.value = ''
  selectedSkills.value = []
  
  Object.assign(filters, {
    minBudget: '',
    maxBudget: '',
    status: [],
    location: '',
    duration: '',
    sortBy: 'newest'
  })
  
  emit('search', '', filters)
}

// Expose methods
defineExpose({
  clearFilters,
  getFilters: () => filters,
  getSearchQuery: () => searchQuery.value
})
</script>
