<script setup lang="ts">
import CourseCard from '@/components/CourseCard.vue'
import { useAxios } from '@vueuse/integrations/useAxios'
import type { Formation } from '@/models/formation'
import { ref } from 'vue'

const activeTab = ref(0)

const tabs = ['Cours actifs', 'Cours terminés']

const { data: formations } = useAxios<Formation[]>('/api/formations')
</script>

<template>
  <div class="flex flex-col gap-4">
    <h1 class="text-2xl font-bold">Formations en cours</h1>

    <div class="container flex flex-col gap-4 p-8">
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

      <div class="flex flex-col grid-cols-3 gap-4 md:grid">
        <!-- TODO: Add a link to the course -->
        <CourseCard v-for="formation in formations" :key="formation.id" :formation="formation">
          <template #footer>
            <!-- TODO: Add a link to the quizz -->
            <button class="transition cursor-pointer size-fit text-primary hover:text-primary-600">
              Suivre le cours &rarr;
            </button>
          </template>
        </CourseCard>
      </div>
    </div>
  </div>
</template>
