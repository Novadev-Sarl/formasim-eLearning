<script setup lang="ts">
const reloadPage = () => {
  window.location.reload()
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen gap-4">
    <span class="text-neutral-500">
      Une erreur est survenue lors du chargement de la page. Veuillez réessayer plus tard.
    </span>

    <span class="text-neutral-500">
      Si le problème persiste, veuillez contacter l'assistance.
    </span>

    <button
      class="px-4 py-2 text-white transition rounded-md cursor-pointer bg-primary hover:bg-primary-700"
      @click="reloadPage"
    >
      Réessayer
    </button>
  </div>
</template>
