import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

// Import your pages
import HomePage from '../pages/HomePage.vue';
import ProjectsPage from '../pages/ProjectsPage.vue';
import MyBidsPage from '../pages/MyBidsPage.vue';
import MessagesPage from '../pages/MessagesPage.vue';
import ProfilePage from '../pages/ProfilePage.vue';
import LoginPage from '../pages/LoginPage.vue';
import RegisterPage from '../pages/RegisterPage.vue';

const routes = [
  { 
    path: '/', 
    name: 'Home', 
    component: HomePage,
    meta: { requiresAuth: true }
  },
  { 
    path: '/projects', 
    name: 'Projects', 
    component: ProjectsPage,
    meta: { requiresAuth: true }
  },
  { 
    path: '/my-bids', 
    name: 'MyBids', 
    component: MyBidsPage,
    meta: { requiresAuth: true }
  },
  { 
    path: '/messages', 
    name: 'Messages', 
    component: MessagesPage,
    meta: { requiresAuth: true }
  },
  { 
    path: '/profile', 
    name: 'Profile', 
    component: ProfilePage,
    meta: { requiresAuth: true }
  },
  { 
    path: '/login', 
    name: 'Login', 
    component: LoginPage,
    meta: { requiresGuest: true }
  },
  { 
    path: '/register', 
    name: 'Register', 
    component: RegisterPage,
    meta: { requiresGuest: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
    return;
  }
  
  // Check if route requires guest (not authenticated)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/');
    return;
  }
  
  next();
});

export default router;