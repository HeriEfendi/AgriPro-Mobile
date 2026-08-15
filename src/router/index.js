import { createRouter, createWebHistory } from '@ionic/vue-router';
import DashboardView from '@/views/DashboardView.vue';
import AgriModuleView from '@/views/AgriModuleView.vue';
import AquaModuleView from '@/views/AquaModuleView.vue';
import LivestockModuleView from '@/views/LivestockModuleView.vue';
import LibraryView from '@/views/LibraryView.vue';

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView
  },
  {
    path: '/agri',
    name: 'Agri',
    component: AgriModuleView
  },
  {
    path: '/aqua',
    name: 'Aqua',
    component: AquaModuleView
  },
  {
    path: '/livestock',
    name: 'Livestock',
    component: LivestockModuleView
  },
  {
    path: '/library',
    name: 'Library',
    component: LibraryView
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
