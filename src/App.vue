<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import axios from 'axios'

import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'

const route = useRoute()

const fullscreenRoutes = ['/login', '/reset-password', '/forgot-password']

const isFullscreenRoute = computed(() => fullscreenRoutes.includes(route.path))
const header = ref<HTMLElement | null>(null)

axios.get(import.meta.env.VITE_API_URL + '/sanctum/csrf-cookie', {
  withCredentials: true,
  withXSRFToken: true,
});

</script>

<template>
  <header class="fixed top-0 left-0 flex flex-col w-full bg-white" v-if="!isFullscreenRoute" ref="header">
    <TheHeader />
  </header>

  <RouterView :style="{ paddingTop: isFullscreenRoute ? '0px' : `${header?.clientHeight}px` }" class="min-h-screen" />

  <footer v-if="!isFullscreenRoute">
    <TheFooter />
  </footer>
</template>
