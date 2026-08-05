<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('servers')

const tabs = [
  { id: 'servers', label: 'Servers', icon: 'dns' },
  { id: 'notifications', label: 'Notifications', icon: 'notifications' },
  { id: 'security', label: 'Security', icon: 'shield' },
  { id: 'about', label: 'About', icon: 'info' },
]
</script>

<template>
  <div class="flex h-[calc(100vh-56px)]">
    <!-- Left: Tab Bar -->
    <aside class="w-[180px] bg-[#0F172A] border-r border-[#1E293B] flex flex-col py-4">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'h-11 px-4 rounded-lg flex items-center gap-3 transition-all mx-2 mb-1',
          activeTab === tab.id
            ? 'bg-[rgba(6,182,212,0.1)] text-[#06B6D4] border-l-[3px] border-[#06B6D4]'
            : 'text-[#94A3B8] hover:bg-[rgba(255,255,255,0.03)]'
        ]"
      >
        <span class="material-symbols-outlined text-[20px]">{{ tab.icon }}</span>
        <span class="text-[14px]">{{ tab.label }}</span>
      </button>
    </aside>

    <!-- Right: Content -->
    <div class="flex-1 p-6 overflow-y-auto">
      <!-- Servers Tab -->
      <div v-if="activeTab === 'servers'">
        <h2 class="text-[20px] font-bold text-[#F1F5F9] mb-6">Server Management</h2>
        
        <div class="bg-[#111827] border border-[#1E293B] rounded-xl p-6 mb-4">
          <h3 class="text-[16px] font-semibold text-[#F1F5F9] mb-4">Add New Server</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[12px] font-bold text-[#94A3B8] uppercase mb-2">Name</label>
              <input type="text" class="w-full h-10 bg-[#1E293B] border border-[#334155] rounded-lg px-3 text-[14px] text-[#F1F5F9] focus:outline-none focus:border-[#06B6D4]" placeholder="e.g., GCP-US-West" />
            </div>
            <div>
              <label class="block text-[12px] font-bold text-[#94A3B8] uppercase mb-2">IP Address</label>
              <input type="text" class="w-full h-10 bg-[#1E293B] border border-[#334155] rounded-lg px-3 text-[14px] text-[#F1F5F9] focus:outline-none focus:border-[#06B6D4]" placeholder="192.168.1.100" />
            </div>
            <div>
              <label class="block text-[12px] font-bold text-[#94A3B8] uppercase mb-2">Port</label>
              <input type="number" class="w-full h-10 bg-[#1E293B] border border-[#334155] rounded-lg px-3 text-[14px] text-[#F1F5F9] focus:outline-none focus:border-[#06B6D4]" value="22" />
            </div>
            <div>
              <label class="block text-[12px] font-bold text-[#94A3B8] uppercase mb-2">User</label>
              <input type="text" class="w-full h-10 bg-[#1E293B] border border-[#334155] rounded-lg px-3 text-[14px] text-[#F1F5F9] focus:outline-none focus:border-[#06B6D4]" value="root" />
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button class="btn-primary">Add Server</button>
            <button class="btn-secondary">Cancel</button>
          </div>
        </div>

        <div class="bg-[#111827] border border-[#1E293B] rounded-xl overflow-hidden">
          <table class="w-full">
            <thead>
              <tr class="bg-[#1E293B] border-b border-[#334155]">
                <th class="text-left px-4 py-3 text-[12px] font-bold text-[#94A3B8] uppercase">Name</th>
                <th class="text-left px-4 py-3 text-[12px] font-bold text-[#94A3B8] uppercase">IP</th>
                <th class="text-left px-4 py-3 text-[12px] font-bold text-[#94A3B8] uppercase">Status</th>
                <th class="text-left px-4 py-3 text-[12px] font-bold text-[#94A3B8] uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-[#1E293B] hover:bg-[rgba(255,255,255,0.02)]">
                <td class="px-4 py-3 text-[13px] text-[#F1F5F9]">GCP-US-West</td>
                <td class="px-4 py-3 text-[13px] font-mono text-[#94A3B8]">192.168.1.100</td>
                <td class="px-4 py-3">
                  <span class="inline-flex items-center gap-1 text-[12px] text-[#10B981]">
                    <div class="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div>
                    Online
                  </span>
                </td>
                <td class="px-4 py-3">
                  <button class="text-[12px] text-[#06B6D4] hover:underline mr-3">Edit</button>
                  <button class="text-[12px] text-[#EF4444] hover:underline">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Notifications Tab -->
      <div v-if="activeTab === 'notifications'">
        <h2 class="text-[20px] font-bold text-[#F1F5F9] mb-6">Notification Settings</h2>
        <div class="bg-[#111827] border border-[#1E293B] rounded-xl p-6 space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-[14px] font-semibold text-[#F1F5F9]">Feishu Webhook</div>
              <div class="text-[12px] text-[#64748B] mt-1">Send alerts to Feishu group</div>
            </div>
            <input type="text" class="w-96 h-10 bg-[#1E293B] border border-[#334155] rounded-lg px-3 text-[14px] text-[#F1F5F9] focus:outline-none focus:border-[#06B6D4]" placeholder="https://open.feishu.cn/open-apis/bot/v2/hook/..." />
          </div>
          <div class="flex items-center justify-between">
            <div>
              <div class="text-[14px] font-semibold text-[#F1F5F9]">Telegram Bot</div>
              <div class="text-[12px] text-[#64748B] mt-1">Send alerts to Telegram</div>
            </div>
            <div class="flex gap-3">
              <input type="text" class="w-48 h-10 bg-[#1E293B] border border-[#334155] rounded-lg px-3 text-[14px] text-[#F1F5F9] focus:outline-none focus:border-[#06B6D4]" placeholder="Bot Token" />
              <input type="text" class="w-32 h-10 bg-[#1E293B] border border-[#334155] rounded-lg px-3 text-[14px] text-[#F1F5F9] focus:outline-none focus:border-[#06B6D4]" placeholder="Chat ID" />
            </div>
          </div>
          <div class="flex items-center justify-between pt-4 border-t border-[#1E293B]">
            <div>
              <div class="text-[14px] font-semibold text-[#F1F5F9]">Certificate Expiry Alert</div>
              <div class="text-[12px] text-[#64748B] mt-1">Notify before certificates expire</div>
            </div>
            <select class="h-10 bg-[#1E293B] border border-[#334155] rounded-lg px-3 text-[14px] text-[#F1F5F9] focus:outline-none focus:border-[#06B6D4]">
              <option>30 days before</option>
              <option>7 days before</option>
              <option>1 day before</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Security Tab -->
      <div v-if="activeTab === 'security'">
        <h2 class="text-[20px] font-bold text-[#F1F5F9] mb-6">Security Settings</h2>
        <div class="bg-[#111827] border border-[#1E293B] rounded-xl p-6 space-y-6">
          <div>
            <label class="block text-[12px] font-bold text-[#94A3B8] uppercase mb-2">JWT Secret</label>
            <input type="password" class="w-full h-10 bg-[#1E293B] border border-[#334155] rounded-lg px-3 text-[14px] text-[#F1F5F9] focus:outline-none focus:border-[#06B6D4]" value="••••••••••••" />
          </div>
          <div>
            <label class="block text-[12px] font-bold text-[#94A3B8] uppercase mb-2">SSH Key Path</label>
            <input type="text" class="w-full h-10 bg-[#1E293B] border border-[#334155] rounded-lg px-3 text-[14px] text-[#F1F5F9] focus:outline-none focus:border-[#06B6D4]" value="~/.ssh/id_rsa" />
          </div>
          <div class="flex items-center justify-between pt-4 border-t border-[#1E293B]">
            <div>
              <div class="text-[14px] font-semibold text-[#F1F5F9]">Audit Log</div>
              <div class="text-[12px] text-[#64748B] mt-1">Record all command executions</div>
            </div>
            <div class="w-11 h-6 bg-[#06B6D4] rounded-full relative cursor-pointer">
              <div class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- About Tab -->
      <div v-if="activeTab === 'about'">
        <h2 class="text-[20px] font-bold text-[#F1F5F9] mb-6">About</h2>
        <div class="bg-[#111827] border border-[#1E293B] rounded-xl p-6">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-16 h-16 bg-gradient-to-br from-[#06B6D4] to-[#2563EB] rounded-2xl flex items-center justify-center">
              <span class="text-[28px] font-bold text-white">⚡</span>
            </div>
            <div>
              <div class="text-[20px] font-bold text-[#F1F5F9]">AI Ops Hub</div>
              <div class="text-[13px] text-[#64748B]">Version 0.1.0</div>
            </div>
          </div>
          <div class="space-y-3 text-[13px] text-[#94A3B8]">
            <p>AI-Native Server Management Platform</p>
            <p>License: MIT</p>
            <p>GitHub: <a href="https://github.com/moisse/ai-ops-hub" class="text-[#06B6D4] hover:underline">github.com/moisse/ai-ops-hub</a></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
</style>
