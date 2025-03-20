<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed, onErrorCaptured, ref, useTemplateRef } from 'vue'

import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import TheErrorMessage from '@/components/TheErrorMessage.vue'

import ToastNotification from '@/components/ToastNotification.vue'
import { useNotificationStore } from '@/stores/notification'
import { useElementSize } from '@vueuse/core'
import { ProgressSpinner } from 'primevue'

const route = useRoute()
const notificationStore = useNotificationStore()
const fullscreenRoutes = ['/login', '/reset-password', '/forgot-password']

const isFullscreenRoute = computed(() => fullscreenRoutes.includes(route.path))
const header = useTemplateRef('header')
const { height: headerHeight } = useElementSize(header)

const error = ref(false)
onErrorCaptured((err) => {
  let additionalMessage = ''

  console.error(`Error: ${err.message}\n  at ${err.stack?.replace(/\n/g, '\n  at ')}`)

  if ('code' in err) {
    additionalMessage += `\n${err.code}`
  }

  error.value = true
  notificationStore.addNotification(
    'Une erreur est survenue lors du chargement de la page (Code: ' + additionalMessage + ')',
    'error',
  )

  return false
})
</script>

<template>
  <header
    class="fixed top-0 left-0 flex flex-col w-full bg-white z-[3] ring-1 ring-neutral-100 shadow-md"
    v-if="!isFullscreenRoute"
    ref="header"
  >
    <TheHeader />
  </header>

  <RouterView v-slot="{ Component }">
    <template v-if="error">
      <TheErrorMessage />
    </template>

    <template v-else>
      <Suspense timeout="0">
        <component
          :is="Component"
          :style="{ paddingTop: isFullscreenRoute ? '0px' : `${headerHeight}px` }"
          class="min-h-screen"
          :class="{ 'pb-16': !isFullscreenRoute }"
        />

        <template #fallback>
          <div class="flex items-center justify-center w-full min-h-screen grow">
            <ProgressSpinner style="stroke: var(--color-primary)" />
          </div>
        </template>
      </Suspense>
    </template>
  </RouterView>

  <footer v-if="!isFullscreenRoute" class="w-full">
    <TheFooter />
  </footer>

  <Teleport to="body">
    <div class="fixed flex flex-col gap-4 top-4 right-4 z-[4]">
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
