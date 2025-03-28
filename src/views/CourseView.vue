<script setup lang="ts">
import BreadCrumbs from '@/components/BreadCrumbs.vue'
import CongratulationModal from './CourseView/CongratulationModal.vue'
import InactivityModal from './CourseView/InactivityModal.vue'

import ArrowBackIcon from '@/assets/icons/arrow-back.svg'
import ArrowForwardIcon from '@/assets/icons/arrow-forward.svg'
import SchoolIcon from '@/assets/icons/school.svg'
import ScheduleIcon from '@/assets/icons/schedule.svg'
import CheckIcon from '@/assets/icons/check.svg'
import CloseIcon from '@/assets/icons/close.svg'

import { useRoute } from 'vue-router'
import { useFormationStore } from '@/stores/formations'
import { formatDuration } from '@/utils/time'
import { authenticatedAxios } from '@/utils/axios'
import { computed, ref } from 'vue'
import type { FormationQuestion } from '@/models/formation'
import { useNotificationStore } from '@/stores/notification'
import { useNow } from '@vueuse/core'
import LoadingIndicator from '@/components/LoadingIndicator.vue'
import CourseSummary from './CourseView/CourseSummary.vue'

const route = useRoute()
const formationID = route.params.id

const notificationStore = useNotificationStore()
const formationStore = useFormationStore()
// Get formation details
const formation = await formationStore.get(+formationID)

// Get the current question
const { data } = await authenticatedAxios.get<{
  question: FormationQuestion
  courseCompleted: boolean
}>(`/api/formations/${formationID}/question`)

/**
 * @var question The current question.
 */
const question = ref(data.question)

/**
 * @var courseCompleted Whether the course is completed.
 */
const courseCompleted = ref(data.courseCompleted)

/**
 * @var showCongratulationModal Whether the congratulation modal should be shown.
 */
const showCongratulationModal = ref(false)

/**
 * @var answer The selected answer to the question.
 */
const answer = ref<string | null>(null)

/**
 * @var spentTime The time spent on the question.
 */
const spentTime = ref<number>(formation.formation_user.spent_time)

/**
 * @var lastActivity The last activity of the user.
 */
const lastActivity = ref(new Date())

/**
 * @var now The current date.
 */
const now = useNow()

const loadingAnswer = ref(false)
/**
 * @var answerData The actual answer to the quesiton. Null if the answer is not validated yet.
 */
const answerData = ref<{
  trueAnswer: string
  newQuestion?: FormationQuestion
} | null>(null)

/**
 * Submit the answer to the question.
 */
const submit = async () => {
  // Prevent multiple submissions
  if (loadingAnswer.value) return
  loadingAnswer.value = true

  // Update the last activity of the user
  lastActivity.value = now.value

  try {
    // Submit the answer to the question
    const { data } = await authenticatedAxios.post<{
      trueAnswer: string | boolean
      newQuestion?: FormationQuestion
      spentTime: number
      courseCompleted: boolean
    }>(`/api/formations/${formationID}/answer`, {
      answer: answer.value,
    })

    // Update the answer data
    answerData.value = {
      trueAnswer: `${data.trueAnswer}`,
      newQuestion: data.newQuestion,
    }

    // Update the spent time
    spentTime.value = data.spentTime

    // Show the congratulation modal if the course was just completed
    if (data.courseCompleted && !courseCompleted.value) {
      showCongratulationModal.value = true
    }
  } catch (error) {
    // Display an error notification if something went wrong
    notificationStore.addNotification(
      'Une erreur est survenue lors de la vérification de la réponse',
      'error',
    )
    // Log the error details
    console.error(error)
  } finally {
    // Allow new submissions
    loadingAnswer.value = false
  }
}

/**
 * @var showSummary Whether the course summary should be shown.
 */
const showSummary = ref(false)

/**
 * Go to the next question.
 */
const nextQuestion = async () => {
  if (!answerData.value) {
    // Display a warning if no answer data is available
    console.warn('No answer data')
    return
  }

  // If answer data is available but no new question is available, this means the user completed all questions.
  if (!answerData.value.newQuestion) {
    // If the summary is not already shown, show it and stop the function
    if (!showSummary.value) {
      showSummary.value = true
      return
    }

    // If the summary is already shown, hide the summary, fetch the new question and show it to the user
    const { data } = await authenticatedAxios.get<{
      question: FormationQuestion
    }>(`/api/formations/${formationID}/question`)

    answerData.value.newQuestion = data.question
    showSummary.value = false
  }

  // Update the question and empty the answer
  question.value = answerData.value.newQuestion
  answer.value = null
  answerData.value = null
}

/**
 * @var remainingTime The remaining time of the course.
 */
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

    <template v-if="showSummary">
      <CourseSummary @continue="nextQuestion" />
    </template>

    <template v-else>
      <CongratulationModal
        v-if="showCongratulationModal"
        :formation-id="+formationID"
        @close="showCongratulationModal = false"
      />

      <InactivityModal
        v-if="lastActivity && now.getTime() - lastActivity.getTime() > 1000 * 60 * 5"
        @close="lastActivity = now"
      />

      <div class="flex flex-col items-center w-full pb-32 bg-neutral-100 max-xl:px-8">
        <div class="flex flex-row justify-between w-full py-8 max-w-7xl">
          <div class="flex flex-col gap-6">
            <RouterLink
              :to="`/formations/${formationID}`"
              class="flex flex-row items-center gap-2 text-primary"
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
        class="relative flex flex-col justify-between w-full gap-16 p-8 -mb-16 bg-white shadow-md -top-32 max-w-7xl rounded-xl ring-1 ring-neutral-200"
      >
        <span class="text-2xl font-bold">{{ question.question }}</span>

        <div class="flex flex-col gap-4">
          <template v-if="question.type === 'true_false'">
            <div class="flex flex-col gap-4">
              <div
                class="flex flex-row items-center justify-between gap-2 px-4 py-2 transition rounded-md ring-1"
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
                <div class="flex flex-row items-center gap-2">
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

                <CheckIcon class="text-green-500 size-6" v-if="answerData?.trueAnswer === 'true'" />
                <CloseIcon
                  class="text-red-500 size-6"
                  v-if="answerData?.trueAnswer === 'false' && answer === 'true'"
                />
              </div>

              <div
                class="flex flex-row items-center justify-between gap-2 px-4 py-2 transition rounded-md ring-1"
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
                <div class="flex flex-row items-center gap-2">
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

                <CheckIcon
                  class="text-green-500 size-6"
                  v-if="answerData?.trueAnswer === 'false'"
                />
                <CloseIcon
                  class="text-red-500 size-6"
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
              class="flex flex-row items-center justify-between gap-2 px-4 py-2 transition rounded-md ring-1"
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
              <div class="flex flex-row items-center gap-2">
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

              <CheckIcon class="text-green-500 size-6" v-if="answerData?.trueAnswer === option" />
              <CloseIcon
                class="text-red-500 size-6"
                v-if="answerData && answerData?.trueAnswer !== option && answer === option"
              />
            </div>
          </template>
        </div>

        <div class="flex flex-row justify-end w-full">
          <button
            class="px-4 py-2 text-white transition rounded-md cursor-pointer bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="loadingAnswer || answer === null"
            @click="submit"
            v-if="!answerData"
          >
            <span v-if="loadingAnswer">
              <LoadingIndicator class="text-white size-4" />
            </span>
            <span v-else class="flex flex-row items-center gap-2"> Vérifier </span>
          </button>

          <button
            class="flex flex-row items-center gap-2 px-4 py-2 text-white transition rounded-md cursor-pointer bg-primary hover:bg-primary/90"
            @click="nextQuestion"
            v-else
          >
            Suivant <ArrowForwardIcon class="size-4" />
          </button>
        </div>
      </div>
    </template>
  </main>
</template>
