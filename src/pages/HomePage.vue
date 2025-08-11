<!-- src/pages/HomePage.vue-->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js'
import { Line } from 'vue-chartjs'

// Register Chart.js modules
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const authStore = useAuthStore()
const loading = ref(true)
const error = ref('')

// Real data from API
const projects = ref([])
const bids = ref([])
const recentActivity = ref([])

// Generate stats from real data
const stats = computed(() => {
  const totalProjects = projects.value.length
  const activeBids = bids.value.length
  const totalEarnings = bids.value.reduce((sum: number, bid: any) => sum + parseFloat(bid.amount), 0)
  
  return [
    { 
      label: authStore.isClient ? 'My Projects' : 'Available Projects', 
      value: totalProjects, 
      color: 'from-purple-500 to-pink-500' 
    },
    { 
      label: authStore.isFreelancer ? 'My Bids' : 'Active Projects', 
      value: activeBids, 
      color: 'from-green-500 to-emerald-500' 
    },
    { 
      label: authStore.isFreelancer ? 'Total Bids Value' : 'Total Budget', 
      value: `$${totalEarnings.toLocaleString()}`, 
      color: 'from-yellow-500 to-orange-500' 
    }
  ]
})

// Fetch real data
const fetchDashboardData = async () => {
  loading.value = true
  error.value = ''

  try {
    // Fetch projects based on user role
    let projectsUrl = 'http://127.0.0.1:8000/api/projects/'
    if (authStore.isClient) {
      projectsUrl += '?client=me'
    }
    
    const [projectsResponse, bidsResponse] = await Promise.all([
      axios.get(projectsUrl),
      authStore.isFreelancer ? axios.get('http://127.0.0.1:8000/api/bids/') : Promise.resolve({ data: [] })
    ])

    projects.value = projectsResponse.data
    bids.value = bidsResponse.data

    // Generate recent activity from real data
    const generateRecentActivity = () => {
      const activities = []
      
      // Add recent projects
      projects.value.slice(0, 3).forEach((project: any) => {
        activities.push({
          text: authStore.isClient 
            ? `You posted "${project.title}"` 
            : `New project: "${project.title}"`,
          time: new Date(project.created_at).toLocaleDateString()
        })
      })
      
      // Add recent bids (for freelancers)
      if (authStore.isFreelancer) {
        bids.value.slice(0, 2).forEach((bid: any) => {
          activities.push({
            text: `You bid $${bid.amount} on "${bid.project?.title || 'a project'}"`,
            time: new Date(bid.created_at).toLocaleDateString()
          })
        })
      }
      
      return activities.slice(0, 5)
    }

    recentActivity.value = generateRecentActivity()

  } catch (err: any) {
    error.value = 'Failed to load dashboard data'
    console.error('Dashboard data error:', err)
  } finally {
    loading.value = false
  }
}

// Chart data based on real data
const chartData = computed(() => {
  // Generate monthly data from projects/bids
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
  const earnings = months.map((_, index) => {
    // Simulate earnings based on project count and bid amounts
    const monthProjects = projects.value.filter((p: any) => {
      const projectDate = new Date(p.created_at)
      return projectDate.getMonth() === index
    }).length
    
    const monthBids = bids.value.filter((b: any) => {
      const bidDate = new Date(b.created_at)
      return bidDate.getMonth() === index
    }).reduce((sum: number, bid: any) => sum + parseFloat(bid.amount), 0)
    
    return authStore.isFreelancer ? monthBids : monthProjects * 500 // Simulate earnings
  })

  return {
    labels: months,
    datasets: [
      {
        label: authStore.isFreelancer ? 'Earnings ($)' : 'Projects Posted',
        data: earnings,
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#4F46E5'
      }
    ]
  }
})

const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      display: true
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const label = context.dataset.label || ''
          const value = context.parsed.y
          return authStore.isFreelancer ? `${label}: $${value}` : `${label}: ${value}`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
})

onMounted(fetchDashboardData)
</script>

<template>
  <div class="p-6 space-y-8">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
      {{ error }}
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- Welcome Message -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">
          Welcome back, {{ authStore.user?.username }}!
        </h1>
        <p class="text-gray-400">
          {{ authStore.isClient 
            ? 'Manage your projects and connect with talented freelancers.' 
            : 'Find great projects and grow your freelance business.' }}
        </p>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="(stat, index) in stats"
          :key="index"
          class="bg-gradient-to-r rounded-xl p-6 shadow-lg text-white"
          :class="stat.color"
        >
          <h3 class="text-lg font-semibold">{{ stat.label }}</h3>
          <p class="text-3xl font-bold mt-2">{{ stat.value }}</p>
        </div>
      </div>

      <!-- Chart and Activity Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <!-- Earnings Chart -->
        <div>
          <h2 class="text-xl font-semibold mb-4 text-white">
            {{ authStore.isFreelancer ? 'Earnings Overview' : 'Projects Overview' }}
          </h2>
          <div class="bg-gray-800 rounded-xl shadow p-4 border border-gray-700">
            <Line :data="chartData" :options="chartOptions" />
          </div>
        </div>

        <!-- Recent Activity -->
        <div>
          <h2 class="text-xl font-semibold mb-4 text-white">Recent Activity</h2>
          <div class="bg-gray-800 rounded-xl shadow p-4 border border-gray-700 space-y-4">
            <div
              v-for="(item, idx) in recentActivity"
              :key="idx"
              class="flex justify-between items-center border-b border-gray-700 pb-2 last:border-none last:pb-0"
            >
              <span class="text-gray-300">{{ item.text }}</span>
              <span class="text-sm text-gray-400">{{ item.time }}</span>
            </div>
            
            <!-- Empty State -->
            <div v-if="recentActivity.length === 0" class="text-center py-8">
              <div class="text-gray-400 mb-2">
                <svg class="mx-auto h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <p class="text-gray-400 text-sm">No recent activity</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mt-8">
        <h2 class="text-xl font-semibold mb-4 text-white">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <router-link
            to="/projects"
            class="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors"
          >
            <div class="text-purple-400 mb-2">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <h3 class="text-white font-medium">{{ authStore.isClient ? 'Create Project' : 'Browse Projects' }}</h3>
            <p class="text-gray-400 text-sm mt-1">
              {{ authStore.isClient ? 'Post a new project' : 'Find work opportunities' }}
            </p>
          </router-link>

          <router-link
            to="/messages"
            class="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors"
          >
            <div class="text-purple-400 mb-2">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <h3 class="text-white font-medium">Messages</h3>
            <p class="text-gray-400 text-sm mt-1">Chat with clients/freelancers</p>
          </router-link>

          <router-link
            to="/profile"
            class="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors"
          >
            <div class="text-purple-400 mb-2">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <h3 class="text-white font-medium">Profile</h3>
            <p class="text-gray-400 text-sm mt-1">Update your information</p>
          </router-link>

          <div
            v-if="authStore.isFreelancer"
            class="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors cursor-pointer"
          >
            <div class="text-purple-400 mb-2">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 class="text-white font-medium">My Bids</h3>
            <p class="text-gray-400 text-sm mt-1">Track your applications</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional: Smooth fade-in animation */
div {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>