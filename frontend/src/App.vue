<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
import TopNav from './components/TopNav.vue'
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-[#0B1120] text-[#F1F5F9]">
    <Sidebar />
    <div class="flex-1 flex flex-col w-full md:ml-[240px] h-screen overflow-hidden">
      <TopNav />
      <main class="flex-1 overflow-y-auto pt-[56px] flex flex-col">
        <router-view />
      </main>
    </div>
  </div>
</template>
