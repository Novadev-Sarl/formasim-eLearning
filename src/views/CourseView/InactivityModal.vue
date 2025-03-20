<script setup lang="ts">
defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-10 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      @click="$emit('close')"
    >
      <div class="flex flex-col gap-4 p-4 bg-white rounded-md" @click.stop>
        <h2 class="text-2xl font-bold">Êtes-vous toujours là ?</h2>
        <p class="text-sm text-neutral-500">
          Vous avez été inactif pendant plus de 5 minutes. Votre temps a été mis en pause.
        </p>
        <div class="flex flex-row justify-end gap-2">
          <button
            class="px-4 py-2 text-white transition rounded-md cursor-pointer bg-primary hover:bg-primary/90"
            @click="$emit('close')"
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
