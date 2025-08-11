import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

interface User {
  id: number
  username: string
  email: string
  role: 'client' | 'freelancer'
}

interface LoginCredentials {
  username: string
  password: string
}

interface RegisterData {
  username: string
  email: string
  password: string
  role: 'client' | 'freelancer'
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isClient = computed(() => user.value?.role === 'client')
  const isFreelancer = computed(() => user.value?.role === 'freelancer')

  // Set up axios defaults
  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Token ${token.value}`
  }

  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
    axios.defaults.headers.common['Authorization'] = `Token ${newToken}`
  }

  const clearToken = () => {
    token.value = null
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }

  const login = async (credentials: LoginCredentials) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', credentials)
      const { token: authToken, user_id, username, role } = response.data
      
      setToken(authToken)
      user.value = {
        id: user_id,
        username,
        role,
        email: '' // Email not returned by login endpoint
      }
      
      return true
    } catch (err: any) {
      error.value = err.response?.data?.non_field_errors?.[0] || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (userData: RegisterData) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register/', userData)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.username?.[0] || 
                   err.response?.data?.email?.[0] || 
                   err.response?.data?.password?.[0] || 
                   'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    clearToken()
  }

  const checkAuth = async () => {
    if (!token.value) return false
    
    try {
      // You might want to add an endpoint to verify token and get user info
      // For now, we'll assume the token is valid if it exists
      return true
    } catch (err) {
      logout()
      return false
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isClient,
    isFreelancer,
    login,
    register,
    logout,
    checkAuth
  }
})
