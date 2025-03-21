<script setup lang="ts">
import { ref } from 'vue'
import DownloadIcon from '@/assets/icons/download.svg'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const activeTab = ref(0)
const tabs = ['Tous']

const certificates = ref([
  {
    name: 'Certificat de formation',
    date: '03.04.2025',
    duration: '10h',
  },
])

const breakpoints = useBreakpoints(breakpointsTailwind)
const isDesktop = breakpoints.greater('md')
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
          'bg-primary text-white': activeTab === 0,
          'bg-neutral-100 text-neutral-500 hover:bg-neutral-200': activeTab !== 0,
        }"
        @click="activeTab = 0"
      >
        {{ tab }}
      </button>
    </div>

    <table class="w-full text-sm border-collapse rounded-md" v-if="isDesktop">
      <thead class="text-left bg-neutral-100">
        <tr>
          <th>Nom du cours</th>
          <th>Date</th>
          <th>Durée du cours</th>
          <th>Certificat</th>
        </tr>
      </thead>

      <tbody class="text-neutral-500">
        <tr
          v-for="certificate in certificates"
          :key="certificate.name"
          class="border border-neutral-100"
        >
          <td>{{ certificate.name }}</td>
          <td>{{ certificate.date }}</td>
          <td>{{ certificate.duration }}</td>
          <td>
            <!-- TODO: Add certificate download -->
            <button
              class="flex flex-row items-center gap-1 cursor-pointer text-primary hover:text-primary-dark"
            >
              <DownloadIcon class="w-5" />
              Télécharger
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="flex flex-col gap-4" v-else>
      <div
        class="container flex flex-row justify-between p-4"
        v-for="certificate in certificates"
        :key="certificate.name"
      >
        <div class="flex flex-col gap-1">
          <span class="text-lg font-bold">{{ certificate.name }}</span>
          <span class="text-sm text-neutral-500">Obtenu le {{ certificate.date }}</span>
          <span class="text-sm text-neutral-500">Durée du cours : {{ certificate.duration }}</span>
        </div>
        <button
          class="flex flex-row items-center gap-1 cursor-pointer text-primary hover:text-primary-dark"
        >
          <DownloadIcon class="size-8" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
table td,
table th {
  padding: calc(var(--spacing) * 4);
  font-weight: var(--font-weight-medium);
}
</style>
