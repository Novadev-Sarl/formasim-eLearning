<script setup lang="ts">
import BreadCrumbs from '@/components/BreadCrumbs.vue'
import CongratulationModal from '@/views/CourseView/CongratulationModal.vue'

import ArrowBackIcon from '@/assets/icons/arrow-back.svg'
import ArrowForwardIcon from '@/assets/icons/arrow-forward.svg'
import SchoolIcon from '@/assets/icons/school.svg'
import ScheduleIcon from '@/assets/icons/schedule.svg'
import CheckIcon from '@/assets/icons/check.svg'
import CloseIcon from '@/assets/icons/close.svg'

import { ProgressSpinner } from 'primevue'

import { useRoute, useRouter } from 'vue-router'
import { useFormationStore } from '@/stores/formations'
import { formatDuration } from '@/utils/time'
import axios from 'axios'
import { computed, ref } from 'vue'
import type { FormationQuestion } from '@/models/formation'
import { useNotificationStore } from '@/stores/notification'

const route = useRoute()
const router = useRouter()
const formationID = route.params.id

const notificationStore = useNotificationStore()
const formationStore = useFormationStore()
const formation = await formationStore.get(+formationID)

const { data } = await axios.get<{ question: FormationQuestion; courseCompleted: boolean }>(
  `/api/formations/${formationID}/question`,
)

const question = ref(data.question)
const courseCompleted = ref(data.courseCompleted)
const showCongratulationModal = ref(false)

const answer = ref<string | null>(null)
const spentTime = ref<number>(formation.formation_user.spent_time)

const loadingAnswer = ref(false)
const answerData = ref<{
  trueAnswer: string
  newQuestion?: FormationQuestion
} | null>(null)
const submit = async () => {
  loadingAnswer.value = true

  try {
    const { data } = await axios.post<{
      trueAnswer: string | boolean
      newQuestion?: FormationQuestion
      spentTime: number
      courseCompleted: boolean
    }>(`/api/formations/${formationID}/answer`, {
      answer: answer.value,
    })

    answerData.value = {
      trueAnswer: `${data.trueAnswer}`,
      newQuestion: data.newQuestion,
    }
    spentTime.value = data.spentTime

    if (data.courseCompleted && !courseCompleted.value) {
      showCongratulationModal.value = true
    }
  } catch (error) {
    notificationStore.addNotification(
      'Une erreur est survenue lors de la vérification de la réponse',
      'error',
    )
    console.error(error)
  } finally {
    loadingAnswer.value = false
  }
}

const nextQuestion = async () => {
  if (!answerData.value) {
    console.warn('No answer data')
    return
  }

  if (!answerData.value.newQuestion) {
    await router.push(`/formations/${formationID}`)
    return
  }

  question.value = answerData.value.newQuestion
  answer.value = null
  answerData.value = null
}

const remainingTime = computed(() => {
  const remainingTime = formation.duration - spentTime.value / 60
  return remainingTime > 0 ? remainingTime : 0
})
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

    <CongratulationModal
      v-if="showCongratulationModal"
      :formation-id="+formationID"
      @close="showCongratulationModal = false"
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
              <span class="text-gray-600">{{ formatDuration(remainingTime) }} restantes</span>
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
              class="transition flex flex-row gap-2 ring-1 py-2 px-4 rounded-md items-center justify-between"
              :class="{
                // Answer not validated
                'bg-neutral-100 ring-neutral-200 cursor-pointer has-checked:bg-primary/10 has-checked:ring-primary':
                  answerData === null,
                // Answer validated, choice correct
                'bg-primary/10 ring-primary': answerData?.trueAnswer === 'true',
                // Answer validated, incorrect choice
                'bg-neutral-100 ring-neutral-200 has-checked:bg-red-100 has-checked:ring-red-500':
                  answerData?.trueAnswer === 'false',
              }"
              @click="
                () => {
                  if (loadingAnswer || answerData !== null) return
                  answer = 'true'
                }
              "
            >
              <div class="flex flex-row gap-2 items-center">
                <input
                  type="radio"
                  name="answer"
                  id="answer-true"
                  class="accent-primary"
                  :checked="answer === 'true'"
                  :disabled="loadingAnswer || answerData !== null"
                />
                <label for="answer-true">Vrai</label>
              </div>

              <CheckIcon class="size-6 text-green-500" v-if="answerData?.trueAnswer === 'true'" />
              <CloseIcon
                class="size-6 text-red-500"
                v-if="answerData?.trueAnswer === 'false' && answer === 'true'"
              />
            </div>

            <div
              class="transition flex flex-row gap-2 ring-1 py-2 px-4 rounded-md items-center justify-between"
              :class="{
                // Answer not validated
                'bg-neutral-100 ring-neutral-200 cursor-pointer has-checked:bg-primary/10 has-checked:ring-primary':
                  answerData === null,
                // Answer validated, choice correct
                'bg-primary/10 ring-primary': answerData?.trueAnswer === 'false',
                // Answer validated, incorrect choice
                'bg-neutral-100 ring-neutral-200 has-checked:bg-red-100 has-checked:ring-red-500':
                  answerData?.trueAnswer === 'true',
              }"
              @click="
                () => {
                  if (loadingAnswer || answerData !== null) return
                  answer = 'false'
                }
              "
            >
              <div class="flex flex-row gap-2 items-center">
                <input
                  type="radio"
                  name="answer"
                  id="answer-false"
                  class="accent-primary"
                  :checked="answer === 'false'"
                  :disabled="loadingAnswer || answerData !== null"
                />
                <label for="answer-false">Faux</label>
              </div>

              <CheckIcon class="size-6 text-green-500" v-if="answerData?.trueAnswer === 'false'" />
              <CloseIcon
                class="size-6 text-red-500"
                v-if="answerData?.trueAnswer === 'true' && answer === 'false'"
              />
            </div>
          </div>
        </template>

        <template v-else-if="question.type === 'open'">
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <input
                type="text"
                id="answer"
                v-model="answer"
                class="w-full"
                placeholder="Entrez votre réponse"
                :disabled="loadingAnswer || answerData !== null"
              />
              <template v-if="answerData">
                <span class="">Réponse attendue :</span>
                <span class="text-sm text-gray-500">
                  {{ answerData.trueAnswer }}
                </span>
              </template>
            </div>
          </div>
        </template>

        <template v-else-if="question.type === 'select'">
          <div
            v-for="(option, index) in question.options"
            :key="index"
            class="transition flex flex-row gap-2 ring-1 py-2 px-4 rounded-md items-center justify-between"
            :class="{
              // Answer not validated
              'bg-neutral-100 ring-neutral-200 has-checked:bg-primary/10 has-checked:ring-primary cursor-pointer':
                answerData === null,
              // answer validated, choice correct
              'bg-primary/10 ring-primary': answerData?.trueAnswer === option,
              // answer validated, incorrect choice
              'bg-neutral-100 ring-neutral-200 has-checked:bg-red-100 has-checked:ring-red-500':
                answerData?.trueAnswer !== option && answerData !== null,
            }"
            @click="
              () => {
                if (loadingAnswer || answerData !== null) return
                answer = option
              }
            "
          >
            <div class="flex flex-row gap-2 items-center">
              <input
                type="radio"
                name="answer"
                :id="`answer-${index}`"
                class="accent-primary"
                :checked="answer === option"
                :disabled="loadingAnswer || answerData !== null"
              />
              <label :for="`answer-${index}`">{{ option }}</label>
            </div>

            <CheckIcon class="size-6 text-green-500" v-if="answerData?.trueAnswer === option" />
            <CloseIcon
              class="size-6 text-red-500"
              v-if="answerData && answerData?.trueAnswer !== option && answer === option"
            />
          </div>
        </template>
      </div>

      <div class="flex flex-row justify-end w-full">
        <button
          class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="loadingAnswer || answer === null"
          @click="submit"
          v-if="!answerData"
        >
          <span v-if="loadingAnswer">
            <ProgressSpinner style="stroke: white; width: 1rem; height: 1rem" stroke-width="8" />
          </span>
          <span v-else class="flex flex-row gap-2 items-center"> Vérifier </span>
        </button>

        <button
          class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition flex flex-row gap-2 items-center cursor-pointer"
          @click="nextQuestion"
          v-else
        >
          Suivant <ArrowForwardIcon class="size-4" />
        </button>
      </div>
    </div>
  </main>
</template>
