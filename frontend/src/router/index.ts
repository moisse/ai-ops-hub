import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Dashboard from '../pages/Dashboard.vue'
import AIChat from '../pages/AIChat.vue'
import Terminal from '../pages/Terminal.vue'
import Certificates from '../pages/Certificates.vue'
import Settings from '../pages/Settings.vue'

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/chat', name: 'AIChat', component: AIChat },
  { path: '/terminal', name: 'Terminal', component: Terminal },
  { path: '/certificates', name: 'Certificates', component: Certificates },
  { path: '/settings', name: 'Settings', component: Settings }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
