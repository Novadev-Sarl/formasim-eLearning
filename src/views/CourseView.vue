<script setup lang="ts">
import BreadCrumbs from '@/components/BreadCrumbs.vue'

import ArrowBackIcon from '@/assets/icons/arrow-back.svg'
import ArrowForwardIcon from '@/assets/icons/arrow-forward.svg'
import SchoolIcon from '@/assets/icons/school.svg'
import ScheduleIcon from '@/assets/icons/schedule.svg'

import { ProgressSpinner } from 'primevue'

import { useRoute } from 'vue-router'
import { useFormationStore } from '@/stores/formations'
import { formatDuration } from '@/utils/time'
import axios from 'axios'
import { ref } from 'vue'

const route = useRoute()
const formationID = route.params.id

const formationStore = useFormationStore()
const formation = await formationStore.get(+formationID)

const { data: question } = await axios.get(`/api/formations/${formationID}/question`)

const answer = ref<string | null>(null)

const loadingAnswer = ref(false)
const nextQuestion = async () => {
  loadingAnswer.value = true

  try {
    await axios.post(`/api/formations/${formationID}/question`, {
      answer: answer.value,
    })
  } catch (error) {
    console.error(error)
  } finally {
    loadingAnswer.value = false
  }
}
</script>

<template>
  <main class="flex flex-col items-center">
    <BreadCrumbs
      :items="[
        { name: 'Mes cours', to: '/formations' },
        { name: formation.name, to: `/formations/${formationID}` },
        { name: question.formation_chapter.name, to: '' },
      ]"
    />

    <div class="flex flex-col items-center w-full pb-32 bg-neutral-100 max-xl:px-8">
      <div class="flex flex-row justify-between w-full py-8 max-w-7xl">
        <div class="flex flex-col gap-6">
          <RouterLink
            :to="`/formations/${formationID}`"
            class="text-primary flex flex-row gap-2 items-center"
          >
            <ArrowBackIcon class="size-4" />
            Retour aux détails de la formation
          </RouterLink>

          <h1 class="text-2xl font-bold">{{ question.formation_chapter.name }}</h1>

          <div class="flex flex-row items-center gap-4">
            <div class="flex flex-row items-center gap-2">
              <SchoolIcon class="size-6 text-primary" />
              <span class="text-gray-600">{{ formation.name }}</span>
            </div>
            <div class="flex flex-row items-center gap-2">
              <ScheduleIcon class="size-6 text-primary" />
              <span class="text-gray-600">{{ formatDuration(formation.duration) }} restantes</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="relative flex flex-col w-full gap-16 p-8 -mb-16 bg-white -top-32 max-w-7xl rounded-xl ring-1 ring-neutral-200 justify-between shadow-md"
    >
      <span class="text-2xl font-bold">{{ question.question }}</span>

      <div class="flex flex-col gap-4">
        <template v-if="question.type === 'true_false'">
          <div class="flex flex-col gap-4">
            <div
              class="transition flex flex-row gap-2 bg-neutral-100 ring-neutral-200 ring-1 has-checked:bg-primary/10 has-checked:ring-primary py-2 px-4 rounded-md items-center cursor-pointer"
              @click="answer = 'true'"
            >
              <input
                type="radio"
                name="answer"
                id="answer-true"
                class="accent-primary"
                :checked="answer === 'true'"
              />
              <label for="answer-true">Vrai</label>
            </div>

            <div
              class="transition flex flex-row gap-2 bg-neutral-100 ring-neutral-200 ring-1 has-checked:bg-primary/10 has-checked:ring-primary py-2 px-4 rounded-md items-center cursor-pointer"
              @click="answer = 'false'"
            >
              <input
                type="radio"
                name="answer"
                id="answer-false"
                class="accent-primary"
                :checked="answer === 'false'"
              />
              <label for="answer-false">Faux</label>
            </div>
          </div>
        </template>

        <template v-else-if="question.type === 'open'">
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2"></div>
          </div>
        </template>

        <template v-else-if="question.type === 'select'">
          <div
            v-for="option in question.options"
            :key="option.id"
            class="transition flex flex-row gap-2 bg-neutral-100 ring-neutral-200 ring-1 has-checked:bg-primary/10 has-checked:ring-primary py-2 px-4 rounded-md items-center cursor-pointer"
          >
            <input type="radio" name="answer" :id="`answer-${option.id}`" class="accent-primary" />
            <label :for="`answer-${option.id}`">{{ option.option }}</label>
          </div>
        </template>
      </div>

      <div class="flex flex-row justify-end w-full">
        <button
          class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition"
          :class="{
            'opacity-50 cursor-not-allowed': loadingAnswer,
            'opacity-100 cursor-pointer': !loadingAnswer,
          }"
          @click="nextQuestion"
          :disabled="loadingAnswer"
        >
          <span v-if="loadingAnswer">
            <ProgressSpinner style="stroke: white; width: 1rem; height: 1rem" stroke-width="8" />
          </span>
          <span v-else class="flex flex-row gap-2 items-center">
            Suivant <ArrowForwardIcon class="size-4" />
          </span>
        </button>
      </div>
    </div>
  </main>
</template>
