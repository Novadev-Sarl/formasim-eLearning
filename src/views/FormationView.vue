<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useFormationStore } from '@/stores/formations'
import { AxiosError } from 'axios'

import ScheduleIcon from '@/assets/icons/schedule.svg'
import FormatListNumberedIcon from '@/assets/icons/format-list-numbered.svg'
import ChaptersList from './FormationView/ChaptersList.vue'

import { formatDuration } from '@/utils/time'
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'

const router = useRouter()
const route = useRoute()

const formationStore = useFormationStore()

const formation = await formationStore.get(+route.params.id).catch(async (err) => {
  if (err instanceof AxiosError) {
    if (err.response?.status === 404) {
      await router.replace('/404')
    }
  }
  throw err
})

const detailTab = ref<'Chapitres' | 'Description' | 'Certificat'>('Description')

const isMobile = useBreakpoints(breakpointsTailwind).smaller('lg')

onMounted(() => {
  if (isMobile.value) {
    detailTab.value = 'Chapitres'
  }
})

watchEffect(() => {
  if (!isMobile.value && detailTab.value === 'Chapitres') {
    detailTab.value = 'Description'
  }
})

const chapters = computed(() => formation.chapters)

const completedChapters = computed(() => {
  return formation.formation_user.completed_chapters.length
})

const remainingTime = computed(() => {
  return formation.duration - formation.formation_user.spent_time
})
</script>

<template>
  <main class="flex flex-col items-center">
    <!-- Breadcrumb -->
    <Teleport to="header">
      <div
        class="flex flex-col items-center justify-center w-full bg-white border-t-1 border-neutral-100 max-xl:px-8"
      >
        <div class="w-full py-2 max-w-7xl">
          <div class="flex flex-row items-center gap-4">
            <RouterLink to="/formations" class="text-black">Mes cours</RouterLink>
            <span class="text-xs text-black">&gt;</span>
            <span class="text-neutral-400">{{ formation.name }}</span>
          </div>
        </div>
      </div>
    </Teleport>

    <div class="flex flex-col items-center w-full pb-32 bg-neutral-100 max-xl:px-8">
      <div class="flex flex-row justify-between w-full py-8 max-w-7xl">
        <div class="flex flex-col gap-6">
          <h1 class="text-2xl font-bold">{{ formation.name }}</h1>

          <div class="flex flex-col md:flex-row md:items-center gap-4">
            <div class="flex flex-row items-center gap-2">
              <FormatListNumberedIcon class="size-6 text-primary" />
              <span class="text-gray-600">{{ chapters.length }} chapitres</span>
            </div>
            <span class="font-bold text-gray-400 hidden md:block">·</span>
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
      class="relative flex flex-row w-full gap-16 p-8 -mb-16 bg-white -top-32 max-w-7xl rounded-xl ring-1 ring-neutral-200 shadow-md"
    >
      <div class="flex flex-col gap-4 shrink-0 min-w-1/3" v-if="!isMobile">
        <h2 class="text-lg font-bold">Chapitres</h2>
        <ChaptersList
          :formation="formation"
          :chapters="chapters"
          :completed-chapters="completedChapters"
          :remaining-time="remainingTime!"
        />
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
            class="flex flex-row items-center gap-2 p-2 cursor-pointer lg:hidden"
            :class="{
              'font-semibold border-b-3 -mb-px border-primary': detailTab === 'Chapitres',
            }"
            @click="detailTab = 'Chapitres'"
          >
            Chapitres
          </button>
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

        <!-- Chapters -->
        <div v-if="detailTab === 'Chapitres'" class="flex flex-col gap-4">
          <ChaptersList
            :formation="formation"
            :chapters="chapters"
            :completed-chapters="completedChapters"
            :remaining-time="remainingTime!"
          />
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
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}
</style>
