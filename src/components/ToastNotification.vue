<script setup lang="ts">
import CheckCircleIcon from '@/assets/icons/check-circle.svg'
import XCircleIcon from '@/assets/icons/cancel.svg'
import CloseIcon from '@/assets/icons/close.svg'

const props = defineProps<{
  /**
   * The notification to display.
   */
  notification: {
    message: string
    type: 'success' | 'error'
  }
}>()

const emit = defineEmits<{
  /**
   * Emitted when the notification should be closed.
   */
  (e: 'close'): void
}>()
</script>

<template>
  <div
    class="bg-white rounded-2xl ring-1 ring-neutral-100 px-6 py-4 flex flex-row shadow-md items-center gap-4"
  >
    <CheckCircleIcon v-if="props.notification.type === 'success'" class="size-6 text-green-500" />
    <XCircleIcon v-else class="size-6 text-red-500" />

    <div class="flex flex-col gap-1">
      <span class="font-semibold">{{
        props.notification.type === 'success' ? 'Succès' : 'Erreur'
      }}</span>
      <p>{{ props.notification.message }}</p>
    </div>

    <button
      class="ml-auto p-2 rounded-md cursor-pointer hover:bg-neutral-100"
      @click="emit('close')"
    >
      <CloseIcon class="size-4 text-neutral-500" />
    </button>
  </div>
</template>
