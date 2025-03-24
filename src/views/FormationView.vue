<script setup lang="ts">
import BreadCrumbs from '@/components/BreadCrumbs.vue'

import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useFormationStore } from '@/stores/formations'
import { AxiosError } from 'axios'
import { authenticatedAxios } from '@/utils/axios'

import ScheduleIcon from '@/assets/icons/schedule.svg'
import FormatListNumberedIcon from '@/assets/icons/format-list-numbered.svg'
import ChaptersList from './FormationView/ChaptersList.vue'

import { formatDuration } from '@/utils/time'
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'
import { useNotificationStore } from '@/stores/notification'
import LoadingIndicator from '@/components/LoadingIndicator.vue'

const router = useRouter()
const route = useRoute()

const formationStore = useFormationStore()
const notificationStore = useNotificationStore()

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
  return Math.max(formation.duration - formation.formation_user.spent_time / 60, 0)
})

const downloadingCertificate = ref(false)
const downloadCertificate = () => {
  if (downloadingCertificate.value) return

  downloadingCertificate.value = true
  authenticatedAxios
    .get(`/api/certificates/${formation.id}`, {
      responseType: 'blob',
    })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `${formation.name}.pdf`
      a.click()
    })
    .catch((error) => {
      console.error(error)
      notificationStore.addNotification(
        'Une erreur est survenue lors du téléchargement du certificat.',
        'error',
      )
    })
    .finally(() => {
      downloadingCertificate.value = false
    })
}
</script>

<template>
  <main class="flex flex-col items-center">
    <!-- Breadcrumb -->
    <BreadCrumbs
      :items="[
        { name: 'Mes cours', to: '/formations' },
        { name: formation.name, to: '' },
      ]"
    />

    <div class="flex flex-col items-center w-full pb-32 bg-neutral-100 max-xl:px-8">
      <div class="flex flex-col justify-between w-full gap-4 py-8 md:flex-row max-w-7xl">
        <div class="flex flex-col gap-6">
          <h1 class="text-2xl font-bold">{{ formation.name }}</h1>

          <div class="flex flex-col gap-4 md:flex-row md:items-center">
            <div class="flex flex-row items-center gap-2">
              <FormatListNumberedIcon class="size-6 text-primary" />
              <span class="text-gray-600">{{ chapters.length }} chapitres</span>
            </div>
            <span class="hidden font-bold text-gray-400 md:block">·</span>
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
        <div class="flex flex-row items-center w-full gap-2 md:w-fit">
          <RouterLink
            :to="`/formations/${formation.id}/course`"
            class="w-full text-center text-white bg-primary action md:w-fit"
          >
            Démarrer le cours
          </RouterLink>
        </div>
      </div>
    </div>

    <div
      class="relative flex flex-row w-full gap-16 p-8 -mb-16 bg-white shadow-md -top-32 max-w-7xl rounded-xl ring-1 ring-neutral-200"
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
        ></div>

        <div v-if="detailTab === 'Certificat'">
          <div class="flex flex-col gap-4">
            <h2 class="text-lg font-bold">Certificat obtenu: {{ formation.certificate_name }}</h2>
            <div v-if="formation.formation_user.completed_at" class="flex flex-col gap-4">
              <p class="text-sm text-gray-600">
                Félicitations ! Vous avez terminé tous les chapitres de cette formation. Vous pouvez
                télécharger votre certificat ci-dessous.
              </p>

              <div class="p-6 bg-white border border-gray-200 rounded-sm">
                <div class="flex flex-col items-center justify-center gap-4">
                  <div class="flex flex-col items-center">
                    <h3 class="text-xl font-bold text-primary">{{ formation.name }}</h3>
                    <p class="text-sm text-gray-600">
                      Certificat obtenu le {{ new Date().toLocaleDateString() }}
                    </p>
                  </div>

                  <button
                    class="px-4 py-2 font-semibold text-white transition-colors rounded-sm cursor-pointer bg-primary hover:bg-primary-600 disabled:bg-primary-200 disabled:cursor-not-allowed"
                    :disabled="downloadingCertificate"
                    @click="downloadCertificate"
                  >
                    <div v-if="downloadingCertificate" class="flex flex-row items-center gap-2">
                      <LoadingIndicator class="size-4" />
                      <span>Téléchargement en cours</span>
                    </div>
                    <span v-else>Télécharger le certificat</span>
                  </button>
                </div>
              </div>
            </div>

            <div v-else class="flex flex-col gap-4">
              <p class="text-sm text-gray-600">
                Vous n'avez pas encore terminé tous les chapitres de cette formation. Terminez tous
                les chapitres pour obtenir votre certificat.
              </p>

              <div class="p-6 bg-gray-100 border border-gray-200 rounded-sm">
                <div class="flex flex-col items-center justify-center gap-2">
                  <p class="font-semibold text-gray-600">
                    Progression: {{ completedChapters }} / {{ chapters.length }} chapitres
                  </p>
                  <div class="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      class="h-2 rounded-full bg-primary"
                      :style="{
                        width: `${(completedChapters / chapters.length) * 100}%`,
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
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
