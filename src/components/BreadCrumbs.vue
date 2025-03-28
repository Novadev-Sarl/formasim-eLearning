<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  /**
   * The items to display in the breadcrumbs.
   */
  items: {
    name: string

    /**
     * Absolute url to the item.
     */
    to: string
  }[]
}>()
</script>

<template>
  <Teleport to="header">
    <div
      class="flex-col items-center justify-center hidden w-full bg-white md:flex border-t-1 border-neutral-100 max-xl:px-8"
    >
      <div class="w-full py-2 max-w-7xl">
        <div class="flex flex-row items-center gap-4">
          <template v-for="item in items.slice(0, -1)" :key="item.to">
            <RouterLink :to="item.to" class="text-black">{{ item.name }}</RouterLink>
            <span class="text-xs text-black">&gt;</span>
          </template>
          <span class="text-neutral-400">{{ items[items.length - 1].name }}</span>
        </div>
      </div>
    </div>
  </Teleport>
</template>
