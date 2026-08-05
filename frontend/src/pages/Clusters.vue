<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18nStore } from '../stores/useI18nStore'

const router = useRouter()
const i18n = useI18nStore()

interface ServerNode {
  id: string;
  hostname: string;
  ip: string;
  region: string;
  status: string;
  cpu: number;
  memory: number;
  latency: number;
}

interface ClusterGroup {
  id: string;
  name: string;
  provider: string;
  nodes: ServerNode[];
  avgCpu: number;
  avgMemory: number;
  avgLatency: number;
  status: 'healthy' | 'warning' | 'empty';
}

const rawServers = ref<ServerNode[]>([])
const customClusters = ref<{ name: string; region: string }[]>([])
const showAddClusterModal = ref(false)

const newClusterName = ref('')
const newClusterRegion = ref('AWS US-East')

async function loadServers() {
  try {
    const res = await fetch('/api/servers')
    if (res.ok) {
      const data = await res.json()
      rawServers.value = data
    }
  } catch (e) {
    console.warn('Clusters fetch fallback')
  }
}

const clusterGroups = computed<ClusterGroup[]>(() => {
  const providersMap: Record<string, ServerNode[]> = {
    'AWS Cloud Cluster': [],
    'GCP Cloud Cluster': [],
    'Tencent Cloud Cluster': [],
    'Aliyun Cloud Cluster': [],
    'Azure / Private Cloud Cluster': []
  }

  // Add custom cluster buckets
  customClusters.value.forEach(c => {
    if (!providersMap[c.name]) {
      providersMap[c.name] = []
    }
  })

  // Group raw servers by cloud provider / region
  rawServers.value.forEach(node => {
    const reg = (node.region || '').toLowerCase()
    if (reg.includes('aws')) providersMap['AWS Cloud Cluster'].push(node)
    else if (reg.includes('gcp')) providersMap['GCP Cloud Cluster'].push(node)
    else if (reg.includes('tencent')) providersMap['Tencent Cloud Cluster'].push(node)
    else if (reg.includes('aliyun')) providersMap['Aliyun Cloud Cluster'].push(node)
    else providersMap['Azure / Private Cloud Cluster'].push(node)
  })

  return Object.keys(providersMap).map(name => {
    const nodes = providersMap[name]
    const count = nodes.length
    const avgCpu = count > 0 ? Math.round(nodes.reduce((acc, n) => acc + (n.cpu || 20), 0) / count) : 0
    const avgMem = count > 0 ? Math.round(nodes.reduce((acc, n) => acc + (n.memory || 30), 0) / count) : 0
    const avgLat = count > 0 ? Math.round(nodes.reduce((acc, n) => acc + (n.latency || 15), 0) / count) : 0

    let status: 'healthy' | 'warning' | 'empty' = 'healthy'
    if (count === 0) status = 'empty'
    else if (nodes.some(n => n.status === 'warning' || n.status === 'offline')) status = 'warning'

    return {
      id: 'cluster_' + name,
      name,
      provider: name.split(' ')[0],
      nodes,
      avgCpu,
      avgMemory: avgMem,
      avgLatency: avgLat,
      status
    }
  })
})

function addCustomCluster() {
  if (!newClusterName.value) return
  customClusters.value.push({
    name: newClusterName.value,
    region: newClusterRegion.value
  })
  showAddClusterModal.value = false
  newClusterName.value = ''
}

function goToDashboard() {
  router.push('/dashboard')
}

onMounted(() => {
  loadServers()
})
</script>

<template>
  <div class="p-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
      <div>
        <h1 class="text-2xl font-bold text-[#F1F5F9]">
          {{ i18n.currentLang === 'zh-CN' ? '多云集群管理 (Cloud Clusters)' : 'Cloud Cluster Management' }}
        </h1>
        <p class="text-xs text-[#94A3B8] mt-1">
          {{ i18n.currentLang === 'zh-CN' ? '按 AWS、GCP、腾讯云、阿里云等维度自动聚合节点健康度与负载' : 'Auto-group node health and load by Cloud Providers & Regions' }}
        </p>
      </div>
      <button 
        @click="showAddClusterModal = true"
        class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#06B6D4] text-[#0B1120] font-bold text-xs hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-[#06B6D4]/20"
      >
        <span class="material-symbols-outlined text-sm">view_module</span>
        <span>{{ i18n.currentLang === 'zh-CN' ? '创建集群分组' : 'Create Cluster Group' }}</span>
      </button>
    </div>

    <!-- Clusters Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div 
        v-for="cluster in clusterGroups" 
        :key="cluster.id"
        class="bg-[#0F172A] border border-[#1E293B] hover:border-[#06B6D4]/40 transition-all rounded-2xl p-6 flex flex-col gap-5 shadow-lg relative"
      >
        <!-- Top Status Row -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#06B6D4]/10 border border-[#06B6D4]/30 flex items-center justify-center text-[#06B6D4]">
              <span class="material-symbols-outlined text-xl">cloud_sync</span>
            </div>
            <div>
              <h3 class="text-base font-bold text-[#F1F5F9]">{{ cluster.name }}</h3>
              <span class="text-xs text-[#64748B] font-mono">{{ cluster.nodes.length }} Nodes Registered</span>
            </div>
          </div>

          <span 
            :class="[
              'px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider',
              cluster.status === 'healthy' ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30' : 
              (cluster.status === 'warning' ? 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30' : 'bg-[#64748B]/15 text-[#64748B] border border-[#64748B]/30')
            ]"
          >
            {{ cluster.status === 'empty' ? 'NO NODES' : (cluster.status === 'healthy' ? 'HEALTHY' : 'ATTENTION') }}
          </span>
        </div>

        <!-- Metrics Grid -->
        <div class="grid grid-cols-3 gap-3 bg-[#1E293B]/40 p-3.5 rounded-xl border border-[#1E293B]">
          <div class="flex flex-col gap-0.5 text-center">
            <span class="text-[11px] text-[#94A3B8]">集群平均 CPU</span>
            <span class="text-base font-mono font-bold text-[#06B6D4]">{{ cluster.avgCpu }}%</span>
          </div>
          <div class="flex flex-col gap-0.5 text-center border-x border-[#1E293B]">
            <span class="text-[11px] text-[#94A3B8]">集群平均 MEM</span>
            <span class="text-base font-mono font-bold text-[#3B82F6]">{{ cluster.avgMemory }}%</span>
          </div>
          <div class="flex flex-col gap-0.5 text-center">
            <span class="text-[11px] text-[#94A3B8]">平均 Ping 延迟</span>
            <span class="text-base font-mono font-bold text-[#10B981]">{{ cluster.avgLatency }}ms</span>
          </div>
        </div>

        <!-- Nodes List inside Cluster -->
        <div class="flex flex-col gap-2">
          <span class="text-[11px] text-[#94A3B8] font-bold uppercase">集群归属节点 (Assigned Nodes)</span>
          <div v-if="cluster.nodes.length === 0" class="text-xs text-[#64748B] italic py-2">
            {{ i18n.currentLang === 'zh-CN' ? '暂无关联节点。在 [仪表盘] 录入服务器时选择该厂商区域即可自动划入。' : 'No nodes assigned. Add servers under this cloud provider in Dashboard.' }}
          </div>
          <div v-else class="flex flex-wrap gap-2">
            <span 
              v-for="node in cluster.nodes" 
              :key="node.id" 
              class="px-2.5 py-1 rounded-lg bg-[#1E293B] border border-[#334155] text-xs font-mono text-[#F1F5F9] flex items-center gap-1.5"
            >
              <span :class="['w-1.5 h-1.5 rounded-full', node.status === 'online' ? 'bg-[#10B981]' : 'bg-[#EF4444]']"></span>
              <span>{{ node.hostname }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Custom Cluster Modal -->
    <div v-if="showAddClusterModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div class="bg-[#0F172A] border border-[#1E293B] rounded-2xl w-full max-w-md p-6 flex flex-col gap-4 shadow-2xl">
        <h3 class="text-base font-bold text-[#F1F5F9] border-b border-[#1E293B] pb-3">
          {{ i18n.currentLang === 'zh-CN' ? '创建自定义云集群分组' : 'Create Custom Cloud Cluster' }}
        </h3>
        <div class="flex flex-col gap-3 text-xs">
          <label class="text-[#94A3B8]">集群分组名称</label>
          <input v-model="newClusterName" placeholder="e.g. AWS-East-Prod-Cluster" class="bg-[#1E293B] border border-[#334155] rounded-lg p-2.5 text-[#F1F5F9] outline-none focus:border-[#06B6D4]" />

          <label class="text-[#94A3B8]">基础云厂商 / 区域</label>
          <select v-model="newClusterRegion" class="bg-[#1E293B] border border-[#334155] rounded-lg p-2.5 text-[#F1F5F9] outline-none focus:border-[#06B6D4]">
            <option value="AWS US-East">AWS US-East</option>
            <option value="GCP US-West">GCP US-West</option>
            <option value="Tencent EU-West">Tencent EU-West</option>
            <option value="Aliyun AP-East">Aliyun AP-East</option>
          </select>
        </div>
        <div class="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-[#1E293B]">
          <button @click="showAddClusterModal = false" class="px-4 py-2 rounded-lg bg-[#1E293B] text-[#94A3B8] text-xs font-bold hover:bg-[#334155]">Cancel</button>
          <button @click="addCustomCluster" class="px-4 py-2 rounded-lg bg-[#06B6D4] text-[#0B1120] text-xs font-bold hover:opacity-90">Create</button>
        </div>
      </div>
    </div>
  </div>
</template>
