<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import axios from 'axios'

import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import ToastNotification from '@/components/ToastNotification.vue'
import { useNotificationStore } from '@/stores/notification'

const route = useRoute()
const notificationStore = useNotificationStore()
const fullscreenRoutes = ['/login', '/reset-password', '/forgot-password']

const isFullscreenRoute = computed(() => fullscreenRoutes.includes(route.path))
const header = ref<HTMLElement | null>(null)

axios.get(import.meta.env.VITE_API_URL + '/sanctum/csrf-cookie', {
  withCredentials: true,
  withXSRFToken: true,
})
</script>

<template>
  <header
    class="fixed top-0 left-0 flex flex-col w-full bg-white z-[3] ring-1 ring-neutral-100"
    v-if="!isFullscreenRoute"
    ref="header"
  >
    <TheHeader />
  </header>

  <RouterView
    :style="{ paddingTop: isFullscreenRoute ? '0px' : `${header?.clientHeight}px` }"
    class="min-h-screen"
    :class="{ 'pb-16': !isFullscreenRoute }"
  />

  <footer v-if="!isFullscreenRoute" class="w-full">
    <TheFooter />
  </footer>

  <Teleport to="body">
    <div class="fixed flex flex-col gap-4 top-4 right-4">
      <TransitionGroup name="toast-notification">
        <ToastNotification
          v-for="notification in notificationStore.notifications"
          :key="notification.id"
          @close="notificationStore.removeNotification(notification.id)"
          :notification="notification"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style>
.toast-notification-enter-active,
.toast-notification-leave-active {
  transition: all 0.3s ease;
}

.toast-notification-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.toast-notification-leave-to {
  opacity: 0;
}
</style>
