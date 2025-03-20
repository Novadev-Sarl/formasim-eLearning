<script setup lang="ts">
import type { DetailedFormation } from '@/models/formation'
import { formatDuration } from '@/utils/time'
import CheckIcon from '@/assets/icons/check.svg'
import LockIcon from '@/assets/icons/lock.svg'
import FormatListNumberedIcon from '@/assets/icons/format-list-numbered.svg'
import ScheduleIcon from '@/assets/icons/schedule.svg'

defineProps<{
  formation: DetailedFormation
  chapters: { id: number; name: string }[]
  completedChapters: number
  remainingTime: number
}>()
</script>

<template>
  <!-- Informations -->
  <div class="flex flex-row gap-4 text-sm">
    <div class="flex flex-row gap-2">
      <FormatListNumberedIcon class="size-6 text-primary" />
      <span class="text-gray-600">{{ completedChapters }}/{{ chapters.length }} complétés</span>
    </div>
    <span class="font-bold text-neutral-400">·</span>
    <div class="flex flex-row gap-2">
      <ScheduleIcon class="size-6 text-primary" />
      <span class="text-gray-600">{{ formatDuration(remainingTime ?? 0) }} restantes</span>
    </div>
  </div>

  <!-- Chapters -->
  <div class="flex flex-col bg-white rounded-lg ring-1 ring-neutral-200">
    <template v-for="(chapter, index) in chapters" :key="chapter.id">
      <div
        class="flex flex-row justify-between gap-4 p-4 text-sm font-medium border-neutral-200"
        :class="{
          'border-t': index !== 0,
          'rounded-t-lg': index === 0,
          'rounded-b-lg': index === chapters.length - 1,
        }"
      >
        <span class="text-gray-600">Chapitre {{ index + 1 }}: {{ chapter.name }}</span>
        <CheckIcon
          class="size-6 text-primary"
          v-if="formation.formation_user.completed_chapters.includes(chapter.id)"
        />
        <LockIcon class="size-6 text-primary" v-else />
      </div>
    </template>
  </div>
</template>
