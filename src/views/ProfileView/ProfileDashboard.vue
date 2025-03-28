<script setup lang="ts">
import CourseCard from '@/components/CourseCard.vue'
import type { Formation } from '@/models/formation'
import { authenticatedAxios } from '@/utils/axios'

// Fetch the formations assigned to the user to dispaly statistics
const [
  { data: assignedFormations },
  { data: completedFormations },
  { data: uncompletedFormations },
] = await Promise.all([
  authenticatedAxios.get<
    {
      formation: Formation
      completed_at: string | null
    }[]
  >('/api/me/formations'),

  authenticatedAxios.get<
    {
      formation: Formation
      completed_at: string | null
    }[]
  >('/api/me/formations?completed=true'),

  authenticatedAxios.get<
    {
      formation: Formation
      completed_at: string | null
    }[]
  >('/api/me/formations?completed=false&started=true'),
])

const formations = [...uncompletedFormations, ...assignedFormations].slice(0, 3)

const stats = [
  {
    label: 'Nombre de cours suivis',
    value: uncompletedFormations.length,
  },
  {
    label: 'Nombre de cours disponibles',
    value: assignedFormations.length,
  },
  {
    label: 'Nombre de certificats obtenus',
    value: completedFormations.length,
  },
]
</script>

<template>
  <div
    class="flex flex-col w-full gap-4 md:flex-row lg:grid"
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

  <h2 class="text-lg font-semibold">Derniers cours suivis</h2>

  <div class="flex flex-col gap-4 md:flex-row" v-if="formations.length > 0">
    <CourseCard
      v-for="formation in formations"
      :key="formation.formation.id"
      :formation="formation.formation"
      :completed-at="formation.completed_at ?? undefined"
      class="shadow-md md:w-1/3"
    />
  </div>
  <div
    v-else
    class="flex flex-col items-center justify-center gap-2 text-center rounded-lg md:p-8 md:bg-white ring-1 ring-neutral-100"
  >
    <h3 class="text-lg font-semibold md:text-xl text-neutral-800">
      Vous n'avez pas encore de cours
    </h3>
    <p class="text-sm md:text-base text-neutral-600 md:max-w-md">
      Pour commencer à suivre un cours, rendez-vous sur la
      <RouterLink to="/formations" class="text-primary hover:text-primary-dark">
        page des formations
      </RouterLink>
      .
    </p>
  </div>
</template>
