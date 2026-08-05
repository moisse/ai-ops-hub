import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Dashboard from '../pages/Dashboard.vue'
import Clusters from '../pages/Clusters.vue'
import AIChat from '../pages/AIChat.vue'
import Terminal from '../pages/Terminal.vue'
import Certificates from '../pages/Certificates.vue'
import Settings from '../pages/Settings.vue'
import Login from '../pages/Login.vue'

const routes: Array<RouteRecordRaw> = [
  { path: '/login', name: 'Login', component: Login, meta: { public: true } },
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/clusters', name: 'Clusters', component: Clusters },
  { path: '/chat', name: 'AIChat', component: AIChat },
  { path: '/terminal', name: 'Terminal', component: Terminal },
  { path: '/certificates', name: 'Certificates', component: Certificates },
  { path: '/settings', name: 'Settings', component: Settings }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Authentication Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('ai_ops_token')
  if (!to.meta.public && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
