<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')
</script>

<template>
  <nav class="hidden md:flex justify-between items-center px-6 w-full h-[56px] fixed top-0 right-0 z-40 bg-[#0B1120] border-b border-[#1E293B] ml-[240px]">
    <div class="flex items-center gap-4">
      <h2 class="text-[18px] font-bold text-[#F1F5F9]">AI Ops Hub</h2>
      <div class="flex items-center gap-6 h-full">
        <a class="text-[14px] text-[#94A3B8] hover:text-[#06B6D4] transition-colors h-full flex items-center" href="#">Nodes</a>
        <a class="text-[14px] text-[#94A3B8] hover:text-[#06B6D4] transition-colors h-full flex items-center" href="#">Clusters</a>
        <a class="text-[14px] text-[#94A3B8] hover:text-[#06B6D4] transition-colors h-full flex items-center" href="#">Security</a>
      </div>
    </div>
    <div class="flex items-center gap-4">
      <button class="text-[#94A3B8] hover:text-[#06B6D4] transition-colors">
        <span class="material-symbols-outlined">notifications</span>
      </button>
      <button class="text-[#94A3B8] hover:text-[#06B6D4] transition-colors">
        <span class="material-symbols-outlined">help</span>
      </button>
      <div class="w-8 h-8 rounded-full border border-[#334155] bg-[#1E293B] flex items-center justify-center">
        <span class="text-[12px] font-bold text-[#06B6D4]">M</span>
      </div>
    </div>
  </nav>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
</style>
