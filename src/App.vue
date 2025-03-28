<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed, onErrorCaptured, ref, useTemplateRef } from 'vue'

import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import TheErrorMessage from '@/components/TheErrorMessage.vue'

import ToastNotification from '@/components/ToastNotification.vue'
import { useNotificationStore } from '@/stores/notification'
import { useElementSize } from '@vueuse/core'
import LoadingIndicator from '@/components/LoadingIndicator.vue'

const route = useRoute()
const notificationStore = useNotificationStore()
/**
 * @var fullscreenRoutes The routes that should be displayed in fullscreen mode. (no header or footer)
 */
const fullscreenRoutes = ['/login', '/reset-password', '/forgot-password']

/**
 * @var isFullscreenRoute Whether the current route is a fullscreen route.
 */
const isFullscreenRoute = computed(() => fullscreenRoutes.includes(route.path))

/**
 * @var header The header element.
 */
const header = useTemplateRef('header')
const { height: headerHeight } = useElementSize(header)

const error = ref(false)
/**
 * Is executed when an error isn't captured by any children.
 * @url https://vuejs.org/api/composition-api-lifecycle.html#onerrorcaptured
 */
onErrorCaptured((err) => {
  let additionalMessage = ''

  // log the error for debugging purposes
  console.error(`Error: ${err.message}\n  at ${err.stack?.replace(/\n/g, '\n  at ')}`)

  // If the error has a code, add it to the additional message
  if ('code' in err) {
    additionalMessage += `\n${err.code}`
  }

  // Display the error message
  error.value = true

  // Display a notification
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
          v-if="Component"
        />
        <!-- If the router is not yet initialized, we show a loading indicatorj -->
        <div v-else class="flex items-center justify-center w-full min-h-screen grow">
          <LoadingIndicator class="text-primary size-24" />
        </div>

        <!-- We also show a loading indicator if the current route is an async component and is not yet resolved -->
        <template #fallback>
          <div class="flex items-center justify-center w-full min-h-screen grow">
            <LoadingIndicator class="text-primary size-24" />
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
