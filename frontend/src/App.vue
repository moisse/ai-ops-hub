<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
import TopNav from './components/TopNav.vue'
import Dashboard from './pages/Dashboard.vue'
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <Sidebar />
    <div class="flex-1 flex flex-col w-full md:ml-[240px] h-screen overflow-hidden">
      <TopNav />
      <main class="flex-1 overflow-y-auto pt-[56px] p-6 flex flex-col gap-6">
        <Dashboard />
      </main>
    </div>
  </div>
</template>
