<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <div class="flex flex-col w-screen">
    <!-- Links-->
    <div></div>

    <!-- Copyright -->
    <div class="flex flex-col items-center w-full bg-neutral-100">
      <div class="flex flex-row items-center justify-between w-full py-3 text-sm max-w-7xl">
        <span>
          &copy; 2025 {{ year > 2025 ? `- ${year}` : '' }} Formasim. Tous droits réservés.
        </span>

        <span>Conçu et développé par <a href="https://novadev.ch" class="text-primary">Novadev Sàrl</a></span>
      </div>
    </div>
  </div>
</template>
