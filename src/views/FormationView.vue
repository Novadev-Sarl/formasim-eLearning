<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useFormationStore } from '@/stores/formations'
import { AxiosError } from 'axios'
import { ProgressSpinner } from 'primevue'

import ScheduleIcon from '@/assets/icons/schedule.svg'
import FormatListNumberedIcon from '@/assets/icons/format-list-numbered.svg'
import CheckIcon from '@/assets/icons/check.svg'
import LockIcon from '@/assets/icons/lock.svg'

import { formatDuration } from '@/utils/time'
import { computed, ref, watch } from 'vue'
import type { DetailedFormation } from '@/models/formation'

const router = useRouter()
const route = useRoute()

const formationStore = useFormationStore()

const formation = ref<DetailedFormation | null>(null)

watch(
  () => route.params.id,
  async (id) => {
    try {
      const res = await formationStore.get(+id)
      formation.value = res
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 404) {
          router.replace('/404')
        }
      }
    }
  },
  { immediate: true },
)

const detailTab = ref<'Description' | 'Certificat'>('Description')

const chapters = computed(() => formation.value?.chapters ?? [])

const completedChapters = computed(() => {
  return formation.value?.formation_user.completed_chapters.length ?? 0
})

const remainingTime = computed(() => {
  if (!formation.value) return undefined
  return formation.value?.duration - formation.value?.formation_user.spent_time
})
</script>

<template>
  <main v-if="formation" class="flex flex-col items-center">
    <!-- Breadcrumb -->
    <Teleport to="header">
      <div
        class="flex flex-col items-center justify-center w-full bg-white border-t-1 border-neutral-100"
      >
        <div class="w-full py-2 max-w-7xl">
          <div class="flex flex-row items-center gap-4">
            <RouterLink to="/formations" class="text-black">Mes cours</RouterLink>
            <span class="text-xs text-black">&gt;</span>
            <span class="text-gray-400">{{ formation.name }}</span>
          </div>
        </div>
      </div>
    </Teleport>

    <div class="flex flex-col items-center w-full pb-32 bg-neutral-100">
      <div class="flex flex-row justify-between w-full py-8 max-w-7xl">
        <div class="flex flex-col gap-6">
          <h1 class="text-2xl font-bold">{{ formation.name }}</h1>

          <div class="flex flex-row items-center gap-4">
            <div class="flex flex-row items-center gap-2">
              <FormatListNumberedIcon class="size-6 text-primary" />
              <span class="text-gray-600">{{ chapters.length }} chapitres</span>
            </div>
            <span class="font-bold text-gray-400">·</span>
            <div class="flex flex-row items-center gap-2">
              <ScheduleIcon class="size-6 text-primary" />
              <span class="text-gray-600">{{ formatDuration(formation.duration) }}</span>
            </div>
          </div>

          <div
            v-if="formation.formation_category"
            class="px-3 py-2 rounded-md bg-neutral-200 text-neutral-400 w-fit"
          >
            {{ formation.formation_category.name }}
          </div>
        </div>
        <div class="flex flex-row items-center gap-2">
          <button class="text-white bg-primary action">Démarrer le cours</button>
        </div>
      </div>
    </div>

    <div
      class="relative flex flex-row w-full gap-16 p-8 -mb-16 bg-white -top-32 max-w-7xl rounded-xl ring-1 ring-neutral-200"
    >
      <div class="flex flex-col gap-4 shrink-0 min-w-1/3">
        <h2 class="text-lg font-bold">{{ formation.name }}</h2>

        <!-- Informations -->
        <div class="flex flex-row gap-4 text-sm">
          <div class="flex flex-row gap-2">
            <FormatListNumberedIcon class="size-6 text-primary" />
            <span class="text-gray-600"
              >{{ completedChapters }}/{{ chapters.length }} complétés</span
            >
          </div>
          <span class="font-bold text-neutral-400">·</span>
          <div class="flex flex-row gap-2">
            <ScheduleIcon class="size-6 text-primary" />
            <span class="text-gray-600">{{ formatDuration(remainingTime ?? 0) }} restantes</span>
          </div>
        </div>

        <!-- Chapters -->
        <div class="flex flex-col bg-white rounded-lg ring-1 ring-neutral-200">
          <template v-for="(chapter, index) in chapters" :key="chapter.id">
            <div
              class="flex flex-row justify-between gap-4 p-4 text-sm font-medium transition cursor-pointer border-neutral-200 hover:bg-neutral-50"
              :class="{
                'border-t': index !== 0,
                'rounded-t-lg': index === 0,
                'rounded-b-lg': index === chapters.length - 1,
              }"
            >
              <span class="text-gray-600">Chapitre {{ index + 1 }}: {{ chapter.name }}</span>
              <CheckIcon
                class="size-6 text-primary"
                v-if="formation.formation_user.completed_chapters.includes(chapter.id)"
              />
              <LockIcon class="size-6 text-primary" v-else />
            </div>
          </template>
        </div>
      </div>

      <!-- Details -->
      <div class="flex flex-col gap-4 grow">
        <img
          :src="formation.image"
          alt="Formation"
          class="object-cover w-full rounded-lg max-h-96"
        />

        <!-- Tabs -->
        <div class="flex flex-row w-full gap-2 border-b border-neutral-200">
          <button
            class="flex flex-row items-center gap-2 p-2 cursor-pointer"
            :class="{
              'font-semibold border-b-3 -mb-px border-primary': detailTab === 'Description',
            }"
            @click="detailTab = 'Description'"
          >
            Description
          </button>
          <button
            class="flex flex-row items-center gap-2 p-2 cursor-pointer"
            :class="{
              'font-semibold border-b-3 -mb-px border-primary': detailTab === 'Certificat',
            }"
            @click="detailTab = 'Certificat'"
          >
            Certificat Obtenu
          </button>
        </div>

        <!-- Description -->
        <div
          v-if="detailTab === 'Description'"
          class="text-sm"
          v-html="
            formation.description /* This is safe, because it comes directly from the backend, which sanitizes the HTML */
          "
        />

        <!-- TODO: Certificat -->
        <div v-if="detailTab === 'Certificat'">
          <div class="flex flex-col gap-4">
            <h2 class="text-lg font-bold">Certificat obtenu</h2>
            <p>Votre certificat est disponible dans votre espace personnel.</p>
          </div>
        </div>
      </div>
    </div>
  </main>
  <div v-else class="flex items-center justify-center h-screen">
    <ProgressSpinner style="stroke: var(--color-primary)" />
  </div>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}
</style>
