import { createRouter, createWebHistory } from 'vue-router';

// Import your pages
import HomePage from '../pages/HomePage.vue';
import ProjectsPage from '../pages/ProjectsPage.vue';
import MyBidsPage from '../pages/MyBidsPage.vue';
import MessagesPage from '../pages/MessagesPage.vue';
import ProfilePage from '../pages/ProfilePage.vue';

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/projects', name: 'Projects', component: ProjectsPage },
  { path: '/my-bids', name: 'MyBids', component: MyBidsPage },
  { path: '/messages', name: 'Messages', component: MessagesPage },
  { path: '/profile', name: 'Profile', component: ProfilePage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;