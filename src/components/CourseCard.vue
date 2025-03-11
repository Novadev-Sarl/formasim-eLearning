<script setup lang="ts">
import FormatListNumberedIcon from '@/assets/icons/format-list-numbered.svg'
import ScheduleIcon from '@/assets/icons/schedule.svg'
</script>

<template>
  <div class="flex flex-col gap-2 bg-white rounded-sm ring-1 ring-neutral-100">
    <img
      src="https://placehold.co/600x400"
      alt="Course Card"
      class="object-cover w-full h-48 rounded-sm"
    />

    <div class="flex flex-col gap-2 px-6 py-4">
      <div class="flex flex-col gap-4">
        <h3 class="text-lg font-semibold">Formation de base</h3>

        <div class="flex flex-row justify-between text-sm">
          <div class="flex flex-row gap-2">
            <FormatListNumberedIcon class="size-6 text-primary" />
            <span class="text-neutral-600">10 chapitres</span>
          </div>

          <div class="flex flex-row gap-2 mr-5">
            <ScheduleIcon class="size-6 text-primary" />
            <span class="text-neutral-600">3h30</span>
          </div>
        </div>

        <hr />

        <div class="flex flex-col gap-1">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>
