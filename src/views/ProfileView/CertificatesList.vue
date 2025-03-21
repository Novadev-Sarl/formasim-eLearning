<script setup lang="ts">
import { ref, computed } from 'vue'
import DownloadIcon from '@/assets/icons/download.svg'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import axios from 'axios'
import type { FormationUser } from '@/models/formation'
import { formatDuration } from '@/utils/time'

const breakpoints = useBreakpoints(breakpointsTailwind)
const isDesktop = breakpoints.greater('md')

const completedFormations = ref(
  await axios
    .get<
      {
        formation_user: FormationUser
        certificate: {
          name: string
          date: string
          duration: number
        }
      }[]
    >('/api/me/completed-formations')
    .then((res) => res.data),
)

const activeTab = ref(0)
const tabs = computed(() => {
  const tabs = ['Tous']

  completedFormations.value.forEach((v) => {
    const { formation } = v.formation_user
    if (!formation) {
      throw new Error('Formation not in response')
    }

    if (formation.formation_category && !tabs.includes(formation.formation_category.name)) {
      tabs.push(formation.formation_category.name)
    }
  })

  return tabs
})

const filteredCompletedFormations = computed(() => {
  if (activeTab.value === 0) {
    return completedFormations.value
  }

  return completedFormations.value.filter((v) => {
    const { formation } = v.formation_user
    if (!formation) {
      throw new Error('Formation not in response')
    }

    return formation.formation_category?.name === tabs.value[activeTab.value]
  })
})
</script>

<template>
  <div class="bg-white flex flex-col gap-4 p-8 rounded-lg ring-1 ring-neutral-100">
    <template v-if="completedFormations.length > 0">
      <template v-if="isDesktop">
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

        <table class="w-full text-sm border-collapse rounded-md">
          <thead class="text-left bg-neutral-100">
            <tr>
              <th>Nom du cours</th>
              <th>Date</th>
              <th>Temps passé</th>
              <th>Certificat</th>
            </tr>
          </thead>

          <tbody class="text-neutral-500">
            <tr
              v-for="(formation, index) in filteredCompletedFormations"
              :key="index"
              class="border border-neutral-100"
            >
              <td>{{ formation.certificate.name }}</td>
              <td>{{ formation.certificate.date }}</td>
              <td>{{ formatDuration(formation.certificate.duration / 60) }}</td>
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
      </template>

      <template v-else>
        <!-- Mobile Tabs -->
        <div class="flex flex-row gap-2 overflow-x-auto pb-2">
          <button
            v-for="(tab, index) in tabs"
            :key="index"
            class="px-4 py-2 whitespace-nowrap transition-all duration-300 rounded-md cursor-pointer"
            :class="{
              'bg-primary text-white': activeTab === index,
              'bg-neutral-100 text-neutral-500 hover:bg-neutral-200': activeTab !== index,
            }"
            @click="activeTab = index"
          >
            {{ tab }}
          </button>
        </div>

        <div class="flex flex-col gap-4">
          <div
            class="container flex flex-row justify-between p-4"
            v-for="(formation, index) in filteredCompletedFormations"
            :key="index"
          >
            <div class="flex flex-col gap-1">
              <span class="text-lg font-bold">{{ formation.certificate.name }}</span>
              <span class="text-sm text-neutral-500"
                >Obtenu le {{ formation.certificate.date }}</span
              >
              <span class="text-sm text-neutral-500">
                Temps passé : {{ formatDuration(formation.certificate.duration / 60) }}
              </span>
            </div>
            <button
              class="flex flex-row items-center gap-1 cursor-pointer text-primary hover:text-primary-dark"
            >
              <DownloadIcon class="size-8" />
            </button>
          </div>
        </div>
      </template>
    </template>

    <div
      v-else
      class="flex flex-col items-center justify-center md:p-8 text-center md:bg-neutral-50 rounded-lg gap-2"
    >
      <h3 class="text-lg md:text-xl font-semibold text-neutral-800">
        Vous n'avez pas encore de certificat
      </h3>
      <p class="text-sm md:text-base text-neutral-600 md:max-w-md">
        Terminez des formations pour obtenir vos premiers certificats. Ils apparaîtront ici une fois
        que vous aurez complété vos cours.
      </p>
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
