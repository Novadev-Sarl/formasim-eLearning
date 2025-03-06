<script setup lang="ts">
import { RouterView } from 'vue-router'

import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import { ref } from 'vue'

// Automatically adapt main content top padding to the header height
const header = ref<HTMLElement | null>(null)
</script>

<template>
  <header class="fixed top-0 left-0 flex flex-col w-full bg-neutral-100" ref="header">
    <TheHeader />
  </header>

  <RouterView :style="{ paddingTop: `${header?.clientHeight}px` }" class="min-h-screen" />

  <footer>
    <TheFooter />
  </footer>
</template>
