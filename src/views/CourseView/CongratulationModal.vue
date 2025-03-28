<script setup lang="ts">
defineProps<{
  /**
   * The ID of the formation that the user has completed.
   */
  formationId: number
}>()

const emit = defineEmits<{
  /**
   * Emitted when the modal should be closed.
   */
  (e: 'close'): void
}>()
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 flex items-center justify-center bg-black/20 z-10 backdrop-blur-sm"
      @click="emit('close')"
    >
      <div class="bg-white p-4 rounded-md flex flex-col gap-4" @click.stop>
        <h2 class="text-2xl font-bold">Félicitations !</h2>
        <p>Vous avez terminé le cours avec succès.</p>
        <p>Vous pouvez continuer à explorer les autres cours, ou revenir à la page d'accueil.</p>
        <div class="flex flex-row gap-2 justify-end">
          <RouterLink
            :to="`/formations/${formationId}`"
            class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition cursor-pointer"
          >
            Revenir à la page d'accueil
          </RouterLink>
          <button
            class="bg-neutral-200 text-neutral-800 px-4 py-2 rounded-md hover:bg-neutral-300 transition cursor-pointer"
            @click="emit('close')"
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
