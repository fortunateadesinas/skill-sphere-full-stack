<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import axios from 'axios';
import CreateProjectForm from '../components/CreateProjectForm.vue';
import ProjectCard from '../components/ProjectCard.vue';
import BidForm from '../components/BidForm.vue';
import AdvancedSearch from '../components/AdvancedSearch.vue';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/vue/24/outline';

interface Project {
  id: number;
  title: string;
  description: string;
  budget: string;
  status: string;
  created_at: string;
  client: number;
  client_username?: string;
}

const authStore = useAuthStore();
const projects = ref<Project[]>([]);
const loading = ref(true);
const error = ref('');
const showCreateForm = ref(false);
const showBidForm = ref(false);
const selectedProject = ref<Project | null>(null);
const searchQuery = ref('');
const statusFilter = ref('all');
const advancedSearch = ref<InstanceType<typeof AdvancedSearch>>();

// Fetch projects based on user role
async function fetchProjects() {
  loading.value = true;
  error.value = '';

  try {
    let url = 'http://127.0.0.1:8000/api/projects/';
    
    // If client, fetch their own projects
    if (authStore.isClient) {
      url += '?client=me';
    }
    
    const response = await axios.get(url);
    projects.value = response.data;
  } catch (err: any) {
    error.value = err.response?.data?.detail || 'Failed to fetch projects';
  } finally {
    loading.value = false;
  }
}

// Filter projects based on search and status
const filteredProjects = computed(() => {
  let filtered = projects.value;

  // Filter by search query
  if (searchQuery.value) {
    filtered = filtered.filter(project =>
      project.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // Filter by status
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(project => project.status === statusFilter.value);
  }

  return filtered;
});

// Handle project creation
const handleProjectCreated = (project: Project) => {
  projects.value.unshift(project);
  showCreateForm.value = false;
};

// Handle project deletion
const handleProjectDeleted = async (project: Project) => {
  if (confirm('Are you sure you want to delete this project?')) {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/projects/${project.id}/`);
      projects.value = projects.value.filter(p => p.id !== project.id);
    } catch (err: any) {
      error.value = 'Failed to delete project';
    }
  }
};

// Handle project editing
const handleProjectEdited = (updatedProject: Project) => {
  const index = projects.value.findIndex(p => p.id === updatedProject.id);
  if (index !== -1) {
    projects.value[index] = updatedProject;
  }
};

// Handle project view
const handleProjectView = (project: Project) => {
  // TODO: Navigate to project details page
  console.log('View project:', project);
};

// Handle bid placement
const handleBidClick = (project: Project) => {
  selectedProject.value = project;
  showBidForm.value = true;
};

// Handle bid submission
const handleBidSubmitted = (bid: any) => {
  showBidForm.value = false;
  selectedProject.value = null;
  // You could show a success message here
  console.log('Bid submitted:', bid);
};

// Handle advanced search
const handleSearch = (query: string, filters: any) => {
  searchQuery.value = query;
  console.log('Advanced search:', { query, filters });
  // In a real app, you'd apply these filters to the API call
};

// Handle filters changed
const handleFiltersChanged = (filters: any) => {
  console.log('Filters changed:', filters);
  // In a real app, you'd apply these filters to the API call
};

onMounted(fetchProjects);
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-white">
          {{ authStore.isClient ? 'My Projects' : 'Available Projects' }}
        </h1>
        <p class="text-gray-400 mt-1">
          {{ authStore.isClient ? 'Manage your posted projects' : 'Browse and bid on projects' }}
        </p>
      </div>
      
      <button
        v-if="authStore.isClient"
        @click="showCreateForm = true"
        class="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
      >
        <PlusIcon class="w-5 h-5" />
        <span>Create Project</span>
      </button>
    </div>

    <!-- Advanced Search (for freelancers) -->
    <div v-if="authStore.isFreelancer">
      <AdvancedSearch
        ref="advancedSearch"
        @search="handleSearch"
        @filters-changed="handleFiltersChanged"
      />
    </div>

    <!-- Basic Search and Filters (for clients) -->
    <div v-if="authStore.isClient" class="flex flex-col md:flex-row gap-4">
      <div class="flex-1 relative">
        <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search projects..."
          class="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      
      <div class="flex items-center space-x-2">
        <FunnelIcon class="w-5 h-5 text-gray-400" />
        <select
          v-model="statusFilter"
          class="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
      {{ error }}
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
    </div>

    <!-- Projects Grid -->
    <div v-else-if="filteredProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ProjectCard
          v-for="project in filteredProjects"
          :key="project.id"
          :project="project"
          @view="handleProjectView"
          @bid="handleBidClick"
          @edit="handleProjectEdited"
          @delete="handleProjectDeleted"
        />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-white mb-2">
        {{ searchQuery || statusFilter !== 'all' ? 'No projects found' : 'No projects yet' }}
      </h3>
      <p class="text-gray-400">
        {{ searchQuery || statusFilter !== 'all' 
          ? 'Try adjusting your search or filters' 
          : authStore.isClient 
            ? 'Create your first project to get started' 
            : 'Check back later for new projects' }}
      </p>
    </div>

    <!-- Create Project Modal -->
    <CreateProjectForm
      v-if="showCreateForm"
      @close="showCreateForm = false"
      @created="handleProjectCreated"
    />

    <!-- Bid Form Modal -->
    <BidForm
      v-if="showBidForm && selectedProject"
      :project="selectedProject"
      @close="showBidForm = false"
      @submitted="handleBidSubmitted"
    />
  </div>
</template>
