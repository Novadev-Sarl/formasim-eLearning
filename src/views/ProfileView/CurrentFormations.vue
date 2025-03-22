<script setup lang="ts">
import CourseCard from '@/components/CourseCard.vue'
import type { Formation } from '@/models/formation'
import { ref, watch } from 'vue'
import axios from 'axios'
import LoadingIndicator from '@/components/LoadingIndicator.vue'

type SelfFormation = {
  formation: Formation
  certificate?: {
    name: string
    date: string
    duration: number
  }
}

const activeTab = ref(0)
const tabs = ['Tous', 'Cours actifs', 'Cours terminés']
const formations = ref<SelfFormation[]>([])
const formationsLoading = ref(0)
watch(
  activeTab,
  async () => {
    try {
      formationsLoading.value++
      if (activeTab.value === 0) {
        formations.value = await axios
          .get<SelfFormation[]>(`/api/me/formations`)
          .then((res) => res.data)
      } else if (activeTab.value === 1) {
        formations.value = await axios
          .get<SelfFormation[]>(`/api/me/formations?completed=false`)
          .then((res) => res.data)
      } else {
        formations.value = await axios
          .get<SelfFormation[]>(`/api/me/formations?completed=true`)
          .then((res) => res.data)
      }
    } finally {
      formationsLoading.value--
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="container flex flex-col gap-4 p-8">
    <!-- Tabs -->
    <div class="flex flex-row gap-4">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        class="px-4 py-2 transition-all duration-300 rounded-md cursor-pointer"
        :class="{
          'bg-primary text-white': activeTab === index,
          'bg-neutral-100 text-neutral-500 hover:bg-neutral-200': activeTab !== index,
        }"
        @click="activeTab = index"
      >
        {{ tab }}
      </button>
    </div>

    <div v-if="formationsLoading > 0">
      <div class="flex flex-col items-center justify-center min-h-96">
        <LoadingIndicator class="size-12 text-primary" />
      </div>
    </div>
    <div class="flex flex-col grid-cols-3 gap-4 md:grid" v-else>
      <CourseCard
        v-for="formation in formations"
        :key="formation.formation.id"
        :formation="formation.formation"
        class="cursor-pointer group"
      />
    </div>
  </div>
</template>
