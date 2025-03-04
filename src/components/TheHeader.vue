<script setup lang="ts">
import CallIcon from '@/components/icons/CallIcon.vue'
import MailIcon from '@/components/icons/MailIcon.vue'
import FacebookF from '@/components/icons/FacebookF.vue'
import InstagramIcon from '@/components/icons/InstagramIcon.vue'
import LinkedInIcon from '@/components/icons/LinkedInIcon.vue'

</script>

<template>
  <div class="flex flex-col items-center w-full">
    <div class="flex flex-row justify-between w-full p-2 max-w-7xl">
      <!-- Contact section -->
      <div class="flex flex-row gap-6 text-sm text-neutral-600">
        <span class="flex flex-row items-center gap-4">
          <CallIcon class="text-primary" />

          <span>Tél : <a href="tel:+41786099716" class="transition-all text-neutral-400 hover:text-black">+41 78 609 97
              16</a></span>
        </span>

        <span class="flex flex-row items-center gap-4">
          <MailIcon class="text-primary" />

          <span>Mail : <a href="mailto:info@formasim.ch"
              class="transition-all text-neutral-400 hover:text-black">info@formasim.ch</a></span>
        </span>
      </div>

      <div class="flex flex-row items-center gap-6 text-sm">
        <a href="https://formasim.ch/fr/qui-sommes-nous" class="transition-all text-neutral-400 hover:text-primary">Qui
          sommes-nous
          ?</a>
        <a href="https://formasim.ch/fr/clients" class="transition-all text-neutral-400 hover:text-primary">Clients</a>
        <div class="flex flex-row gap-3 text-neutral-400">
          <!-- Social networks -->
          <a href="https://www.facebook.com/AntoineChoffatFormationsContinuesPourAdultes">
            <FacebookF class="transition-all size-4 text-neutral-400 hover:text-primary" />
          </a>
          <a href="https://www.instagram.com/formasim_sarl/">
            <InstagramIcon class="transition-all size-4 text-neutral-400 hover:text-primary" />
          </a>
          <a href="https://www.linkedin.com/in/antoine-choffat-6821b6a0/">
            <LinkedInIcon class="transition-all size-4 text-neutral-400 hover:text-primary" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
