<script setup lang="ts">
import { ref } from 'vue'
import CourseCard from '@/components/CourseCard.vue'
import DownloadIcon from '@/assets/icons/download.svg'

const stats = ref([
  {
    label: 'Nombre de cours suivis',
    value: 10,
  },
  {
    label: 'Nombre de cours suivis',
    value: 10,
  },
  {
    label: 'Nombre de cours suivis',
    value: 10,
  },
])
console.log('rawr')
</script>

<template>
  <div class="flex flex-col gap-4">
    <h1 class="text-2xl font-bold">Tableau de bord</h1>
    <div
      class="flex flex-col w-full gap-4 md:flex-row lg:grid"
      :class="{
        'grid-cols-4': stats.length % 3 === 1,
        'grid-cols-3': stats.length % 3 !== 1,
      }"
    >
      <div
        v-for="(stat, index) in stats"
        :key="index"
        class="flex flex-col gap-2 p-4 bg-white rounded-sm ring-1 ring-neutral-100"
      >
        <span class="text-sm text-neutral-500">{{ stat.label }}</span>
        <span class="text-2xl font-bold">{{ stat.value }}</span>
      </div>
    </div>

    <h2 class="text-lg font-semibold">Derniers cours suivis</h2>

    <div class="flex flex-col gap-4 md:flex-row">
      <!-- todo: dynamic courses -->
      <CourseCard v-for="i in 3" :key="i" class="shadow-md md:w-1/3">
        <template #footer>
          <!-- todo: dynamic date -->
          <span class="text-sm text-neutral-500">Suivi le 04.03.2024</span>
          <!-- todo: link to download -->
          <div
            class="flex flex-row items-center gap-1 text-sm cursor-pointer text-primary"
            @click="() => console.log('dowload certificate')"
          >
            <DownloadIcon class="size-5" />
            <span>Télécharger le certificat</span>
          </div>
        </template>
      </CourseCard>
    </div>
  </div>
</template>
