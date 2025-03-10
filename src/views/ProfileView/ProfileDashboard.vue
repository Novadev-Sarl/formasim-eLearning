<script setup lang="ts">
import { ref } from 'vue'

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
</script>

<template>
  <div class="flex flex-col gap-4">
    <h1 class="text-2xl font-bold">Tableau de bord</h1>
    <div
      class="grid w-full gap-4"
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

    <h2 class="text-lg font-medium">Derniers cours suivis</h2>

    <!-- TODO: TBD -->
  </div>
</template>
