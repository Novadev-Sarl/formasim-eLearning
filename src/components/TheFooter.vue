<script setup lang="ts">
import FacebookIcon from '@/assets/icons/facebook.svg'
import InstagramIcon from '@/assets/icons/instagram.svg'
import LinkedInIcon from '@/assets/icons/linkedin.svg'

const year = new Date().getFullYear()
</script>

<template>
  <div class="flex flex-col w-full">
    <!-- Links-->
    <div class="flex flex-col items-center w-full bg-white max-xl:px-8">
      <div
        class="grid flex-row flex-wrap justify-around w-full grid-cols-[auto_auto] gap-8 py-10 text-sm lg:flex max-w-7xl"
      >
        <!-- Contact -->
        <div class="flex flex-col gap-4">
          <span class="text-base font-semibold">Contactez-nous</span>
          <div class="flex flex-col">
            <span>FormaSim Sàrl</span>
            <span><a href="tel:+41797897312" class="text-primary">+41 79 789 73 12</a></span>
            <span><a href="mailto:info@formasim.ch" class="text-primary">info@formasim.ch</a></span>
          </div>

          <div class="flex flex-col">
            <span class="font-semibold">Centre de simulation médicale</span>
            <span>Coin du Jonc 39</span>
            <span>2942 Alle (JU)</span>
          </div>
        </div>

        <!-- Speed dial -->
        <div class="flex flex-col gap-3">
          <span class="text-base font-semibold">Accès rapide</span>
          <RouterLink to="/">Accueil</RouterLink>
          <RouterLink to="/formations">Mes cours</RouterLink>
          <RouterLink to="/profile">Mon profil</RouterLink>
        </div>

        <!-- Other pages -->
        <div class="flex flex-col gap-3">
          <span class="text-base font-semibold">Autres pages</span>
          <a href="https://formasim.ch/fr/conditions-generales"
            >Conditions générales d'utilisation</a
          >
          <a href="https://formasim.ch/fr/protection-des-donnees">Protection des données</a>
        </div>

        <!-- Social media -->
        <div class="flex flex-col gap-3">
          <span class="text-base font-semibold">Suivez-nous</span>
          <div class="flex flex-row items-center gap-4 text-neutral-500">
            <a href="https://www.facebook.com/AntoineChoffatFormationsContinuesPourAdultes">
              <FacebookIcon class="transition-colors duration-300 size-4 hover:text-black" />
            </a>
            <a href="https://www.instagram.com/formasim_sarl/">
              <InstagramIcon class="transition-colors duration-300 size-4 hover:text-black" />
            </a>
            <a href="https://www.linkedin.com/in/antoine-choffat-6821b6a0/">
              <LinkedInIcon class="transition-colors duration-300 size-4 hover:text-black" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Copyright -->
    <div class="flex flex-col items-center w-full bg-neutral-100 max-xl:px-8">
      <div class="flex flex-row items-center justify-between w-full py-3 text-sm max-w-7xl">
        <span>
          &copy; 2025 {{ year > 2025 ? `- ${year}` : '' }} Formasim. Tous droits réservés.
        </span>

        <span
          >Conçu et développé par
          <a href="https://novadev.ch" class="text-primary">Novadev Sàrl</a></span
        >
      </div>
    </div>
  </div>
</template>
