<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useFormationStore } from '@/stores/formations'
import { asyncComputed } from '@vueuse/core'
import { AxiosError } from 'axios'
import { ProgressSpinner } from 'primevue'
import ScheduleIcon from '@/assets/icons/schedule.svg'
import FormatListNumberedIcon from '@/assets/icons/format-list-numbered.svg'

import { formatDuration } from '@/utils/time'

const router = useRouter()
const route = useRoute()
const formationId = +route.params.id

const formationStore = useFormationStore()

const formation = asyncComputed(
  async () =>
    await formationStore.get(formationId).catch((err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 404) {
          router.replace('/404')
        }
      }
    }),
  null,
)
</script>

<template>
  <main v-if="formation" class="flex flex-col items-center h-screen">
    <!-- Breadcrumb -->
    <Teleport to="header">
      <div
        class="flex flex-col w-full justify-center items-center border-t-1 border-neutral-100 bg-white"
      >
        <div class="w-full max-w-7xl py-2">
          <div class="flex flex-row gap-4 items-center">
            <RouterLink to="/formations" class="text-black">Mes cours</RouterLink>
            <span class="text-black text-xs">&gt;</span>
            <span class="text-gray-400">{{ formation.name }}</span>
          </div>
        </div>
      </div>
    </Teleport>

    <div class="w-full bg-neutral-100 flex flex-col items-center">
      <div class="w-full max-w-7xl py-8 flex flex-row justify-between">
        <div class="flex flex-col gap-6">
          <h1 class="text-2xl font-bold">{{ formation.name }}</h1>

          <div class="flex flex-row gap-4 items-center">
            <div class="flex flex-row gap-2 items-center">
              <FormatListNumberedIcon class="size-6 text-primary" />
              <span class="text-gray-600">{{ formation.chapters_count }} chapitres</span>
            </div>
            <span class="text-gray-400 font-bold">·</span>
            <div class="flex flex-row gap-2 items-center">
              <ScheduleIcon class="size-6 text-primary" />
              <span class="text-gray-600">{{ formatDuration(formation.duration) }}</span>
            </div>
          </div>

          <div
            v-if="formation.formation_category"
            class="bg-neutral-200 px-3 py-2 text-neutral-400 w-fit rounded-md"
          >
            {{ formation.formation_category.name }}
          </div>
        </div>
        <div class="flex flex-row gap-2 items-center">
          <button class="bg-primary text-white action">Démarrer le cours</button>
        </div>
      </div>

      
    </div>
  </main>
  <div v-else class="flex items-center justify-center h-screen">
    <ProgressSpinner style="stroke: var(--color-primary)" />
  </div>
</template>
