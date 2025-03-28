<template>
  <div class="flex flex-col items-center justify-center w-full max-w-screen-lg grow">
    <div
      class="flex flex-col items-center w-full gap-8 p-8 bg-white shadow-md rounded-xl ring-1 ring-neutral-200"
    >
      <div class="flex flex-col items-center gap-4">
        <div class="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <CheckIcon class="w-8 h-8 text-primary" />
        </div>
        <h1 class="text-2xl font-bold">Félicitations !</h1>
        <p class="text-center text-gray-600">
          Vous avez parcouru toutes les questions de la formation!
        </p>
      </div>

      <div class="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        <div class="flex flex-col gap-2 p-4 rounded-lg bg-neutral-50">
          <div class="flex items-center gap-2">
            <ScheduleIcon class="w-5 h-5 text-primary" />
            <span class="font-medium">Temps passé</span>
          </div>
          <span class="text-gray-600">
            {{ formatDuration(formation.formation_user.spent_time) }} /
            {{ formatDuration(formation.duration) }}
          </span>
        </div>

        <div class="flex flex-col gap-2 p-4 rounded-lg bg-neutral-50">
          <div class="flex items-center gap-2">
            <StarIcon class="w-5 h-5 text-primary" />
            <span class="font-medium">Score</span>
          </div>
          <span class="text-gray-600">
            {{ formation.formation_user.correct_answers }} /
            {{ formation.formation_user.total_questions }}
          </span>
        </div>
      </div>

      <div class="flex flex-row w-full gap-4">
        <RouterLink
          :to="`/formations/${formationID}`"
          class="flex items-center justify-center w-full gap-2 px-4 py-2 transition rounded-md bg-neutral-200 hover:bg-neutral-300"
        >
          <ArrowBackIcon class="w-4 h-4" />
          Retour aux détails de la formation
        </RouterLink>

        <button
          @click="$emit('continue')"
          class="flex items-center justify-center w-full gap-2 px-4 py-2 text-white transition rounded-md cursor-pointer bg-primary hover:bg-primary-600"
        >
          Continuer la formation
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useFormationStore } from '@/stores/formations'
import { formatDuration } from '@/utils/time'

import CheckIcon from '@/assets/icons/check.svg'
import ScheduleIcon from '@/assets/icons/schedule.svg'
import ArrowBackIcon from '@/assets/icons/arrow-back.svg'
import StarIcon from '@/assets/icons/star.svg'

defineEmits<{
  /**
   * Emitted when the user wants to continue the formation.
   */
  (e: 'continue'): void
}>()

const route = useRoute()
const formationID = route.params.id
const formationStore = useFormationStore()

const formation = await formationStore.get(+formationID, true)
</script>
