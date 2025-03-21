<script setup lang="ts">
import FormatListNumberedIcon from '@/assets/icons/format-list-numbered.svg'
import ScheduleIcon from '@/assets/icons/schedule.svg'
import type { Formation } from '@/models/formation'
import { formatDuration } from '@/utils/time'
import ArrowForwardIcon from '@/assets/icons/arrow-forward.svg'
import DownloadIcon from '@/assets/icons/download.svg'

defineProps<{
  formation: Formation
  completedAt?: string
}>()
</script>

<template>
  <RouterLink
    :to="`/formations/${formation.id}`"
    class="flex flex-col gap-2 bg-white rounded-sm cursor-pointer ring-1 ring-neutral-100 group"
  >
    <img :src="formation.image" alt="Course Card" class="object-cover w-full h-48 rounded-sm" />

    <div class="flex flex-col gap-2 px-6 py-4">
      <div class="flex flex-col gap-4">
        <h3 class="text-lg font-semibold">{{ formation.name }}</h3>

        <div class="flex flex-row justify-between text-sm">
          <div class="flex flex-row gap-2">
            <FormatListNumberedIcon class="size-6 text-primary" />
            <span class="text-neutral-600">10 chapitres</span>
          </div>

          <div class="flex flex-row gap-2 mr-5">
            <ScheduleIcon class="size-6 text-primary" />
            <span class="text-neutral-600">{{ formatDuration(formation.duration) }}</span>
          </div>
        </div>

        <hr />

        <div class="flex flex-col gap-1">
          <slot name="footer">
            <template v-if="completedAt">
              <span class="text-sm text-neutral-500">
                Suivi le {{ new Date(completedAt).toLocaleDateString('fr-CH') }}
              </span>
              <div
                class="flex flex-row items-center gap-1 text-sm cursor-pointer text-primary"
                @click="() => console.log('dowload certificate')"
              >
                <DownloadIcon class="size-5" />
                <span>Télécharger le certificat</span>
              </div>
            </template>
            <template v-else>
              <div
                class="flex flex-row items-center justify-center gap-1 px-4 py-2 text-sm text-white transition rounded-sm cursor-pointer bg-primary group-hover:bg-primary-600"
              >
                <span>Suivre le cours</span>
                <ArrowForwardIcon class="size-4" />
              </div>
            </template>
          </slot>
        </div>
      </div>
    </div>
  </RouterLink>
</template>
