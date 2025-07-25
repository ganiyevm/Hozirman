import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  }
]

const router = createRouter({
  // GitHub Pages uchun base URL - vue.config.js dagi publicPath bilan mos bo'lishi kerak
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router