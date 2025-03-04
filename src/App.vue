<script setup lang="ts">
import { RouterView } from 'vue-router'

import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
</script>

<template>
  <header class="fixed top-0 left-0 flex flex-col w-full bg-neutral-100">
    <TheHeader />
  </header>

  <RouterView />

  <footer>
    <TheFooter />
  </footer>
</template>
