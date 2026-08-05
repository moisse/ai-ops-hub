<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from './components/Sidebar.vue'
import TopNav from './components/TopNav.vue'
import Dashboard from './pages/Dashboard.vue'
import AIChat from './pages/AIChat.vue'
import Terminal from './pages/Terminal.vue'
import Certificates from './pages/Certificates.vue'
import Settings from './pages/Settings.vue'

const currentPage = ref('dashboard')
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <Sidebar @navigate="currentPage = $event" />
    <div class="flex-1 flex flex-col w-full md:ml-[240px] h-screen overflow-hidden">
      <TopNav />
      <main class="flex-1 overflow-y-auto pt-[56px] flex flex-col">
        <Dashboard v-if="currentPage === 'dashboard'" />
        <AIChat v-else-if="currentPage === 'chat'" />
        <Terminal v-else-if="currentPage === 'terminal'" />
        <Certificates v-else-if="currentPage === 'certificates'" />
        <Settings v-else-if="currentPage === 'settings'" />
      </main>
    </div>
  </div>
</template>
