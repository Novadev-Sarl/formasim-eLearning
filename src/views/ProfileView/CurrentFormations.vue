<script setup lang="ts">
import CourseCard from '@/components/CourseCard.vue'
import type { Formation } from '@/models/formation'
import { ref, watch } from 'vue'
import { authenticatedAxios } from '@/utils/axios'
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

/**
 * Watch the active tab and fetch the formations based on the active tab.
 */
watch(
  activeTab,
  async () => {
    try {
      formationsLoading.value++
      const params = new URLSearchParams({
        started: activeTab.value <= 1 ? 'true' : '',
        completed: activeTab.value === 0 ? '' : activeTab.value === 2 ? 'true' : 'false',
      })

      formations.value = await authenticatedAxios
        .get<SelfFormation[]>(`/api/me/formations?${params}`)
        .then((res) => res.data)
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
    <div class="flex flex-col grid-cols-3 gap-4 md:grid" v-else-if="formations.length > 0">
      <CourseCard
        v-for="formation in formations"
        :key="formation.formation.id"
        :formation="formation.formation"
        class="cursor-pointer group"
      />
    </div>
    <div
      v-else
      class="flex flex-col items-center justify-center gap-2 text-center rounded-lg md:p-8 md:bg-neutral-50"
    >
      <h3 class="text-lg font-semibold md:text-xl text-neutral-800">
        Vous n'avez pas encore de cours
      </h3>
      <p class="text-sm md:text-base text-neutral-600 md:max-w-md">
        Pour commencer à suivre un cours, rendez-vous sur la
        <RouterLink to="/formations" class="text-primary hover:text-primary-dark">
          page des formations
        </RouterLink>
        .
      </p>
    </div>
  </div>
</template>
