<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'

import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'

const route = useRoute()
</script>

<template>
  <header class="fixed top-0 left-0 flex flex-col w-full bg-neutral-100" v-if="route.path !== '/login'">
    <TheHeader />
  </header>

  <RouterView />

  <footer v-if="route.path !== '/login'">
    <TheFooter />
  </footer>
</template>
