<script setup lang="ts">
import { ref, computed } from 'vue'
import DownloadIcon from '@/assets/icons/download.svg'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { authenticatedAxios } from '@/utils/axios'
import type { Formation } from '@/models/formation'
import { formatDuration } from '@/utils/time'
import { useNotificationStore } from '@/stores/notification'
import LoadingIndicator from '@/components/LoadingIndicator.vue'

type SelfFormation = {
  formation: Formation
  certificate?: {
    name: string
    date: string
    duration: number
  }
}

const notificationStore = useNotificationStore()

const breakpoints = useBreakpoints(breakpointsTailwind)
const isDesktop = breakpoints.greater('md')

const completedFormations = ref(
  await authenticatedAxios
    .get<SelfFormation[]>(`/api/me/formations?completed=true`)
    .then((res) => res.data),
)

const activeTab = ref(0)
const tabs = computed(() => {
  const tabs = ['Tous']

  completedFormations.value.forEach(({ formation }) => {
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

  return completedFormations.value.filter(({ formation }) => {
    if (!formation) {
      throw new Error('Formation not in response')
    }

    return formation.formation_category?.name === tabs.value[activeTab.value]
  })
})

const loadingCertificates = ref<number[]>([])
const downloadCertificate = async (formationId: number) => {
  // Prevent multiple downloads of the same certificate
  if (loadingCertificates.value.includes(formationId)) return

  // Track loading state
  loadingCertificates.value.push(formationId)

  try {
    // Fetch certificate as blob
    const response = await authenticatedAxios.get(`/api/certificates/${formationId}`, {
      responseType: 'blob',
    })

    // Create download link
    const url = window.URL.createObjectURL(response.data)
    const link = document.createElement('a')
    link.href = url
    link.download = `certificat-${formationId}.pdf`
    link.click()

    // Clean up object URL
    window.URL.revokeObjectURL(url)
  } catch (error) {
    notificationStore.addNotification(
      "Une erreur s'est produite lors du téléchargement du certificat",
      'error',
    )
    console.error(error)
  } finally {
    // Remove from loading state
    loadingCertificates.value = loadingCertificates.value.filter((id) => id !== formationId)
  }
}
</script>

<template>
  <div class="flex flex-col gap-4 p-8 bg-white rounded-lg ring-1 ring-neutral-100">
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
              <td>{{ formation.certificate?.name }}</td>
              <td>{{ formation.certificate?.date }}</td>
              <td>{{ formatDuration((formation.certificate?.duration ?? 0) / 60) }}</td>
              <td>
                <button
                  class="flex flex-row items-center gap-1 cursor-pointer text-primary hover:text-primary-dark"
                  @click="downloadCertificate(formation.formation.id)"
                  :disabled="loadingCertificates.includes(formation.formation.id)"
                >
                  <LoadingIndicator
                    class="size-4"
                    v-if="loadingCertificates.includes(formation.formation.id)"
                  />
                  <DownloadIcon v-else class="w-5" />
                  Télécharger
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </template>

      <template v-else>
        <!-- Mobile Tabs -->
        <div class="flex flex-row gap-2 pb-2 overflow-x-auto">
          <button
            v-for="(tab, index) in tabs"
            :key="index"
            class="px-4 py-2 transition-all duration-300 rounded-md cursor-pointer whitespace-nowrap"
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
              <span class="text-lg font-bold">{{ formation.certificate?.name }}</span>
              <span class="text-sm text-neutral-500"
                >Obtenu le {{ formation.certificate?.date }}</span
              >
              <span class="text-sm text-neutral-500">
                Temps passé : {{ formatDuration(formation.certificate?.duration ?? 0 / 60) }}
              </span>
            </div>
            <button
              class="flex flex-row items-center gap-1 cursor-pointer text-primary hover:text-primary-dark"
              @click="downloadCertificate(formation.formation.id)"
              :disabled="loadingCertificates.includes(formation.formation.id)"
            >
              <LoadingIndicator v-if="loadingCertificates.includes(formation.formation.id)" />
              <DownloadIcon v-else class="size-8" />
            </button>
          </div>
        </div>
      </template>
    </template>

    <div
      v-else
      class="flex flex-col items-center justify-center gap-2 text-center rounded-lg md:p-8 md:bg-neutral-50"
    >
      <h3 class="text-lg font-semibold md:text-xl text-neutral-800">
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
