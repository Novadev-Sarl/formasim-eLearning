<script setup lang="ts">
import LoginCover from '@/assets/images/login-cover.jpeg'

import ArrowForwardIcon from '@/assets/icons/arrow-forward.svg'
import { useTemplateRef } from 'vue'

const overview = useTemplateRef('overview')

/**
 * Scroll to the overview section.
 */
const scrollToOverview = () => {
  overview.value?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <main class="flex flex-col items-stretch w-full">
    <div class="relative w-full">
      <img class="absolute inset-0 object-cover w-full h-full -z-1" :src="LoginCover" alt="" />
      <div class="flex flex-col items-center justify-center py-20 md:py-28 lg:py-36 bg-black/50">
        <div class="flex flex-col w-full gap-4 px-4 md:gap-5 sm:px-6 lg:px-8 max-w-7xl">
          <h1
            class="w-full text-2xl font-bold text-white md:w-2/3 lg:w-1/2 xl:w-1/3 sm:text-3xl md:text-4xl"
          >
            eLearning FormaSim : Formations médicales sur mesure
          </h1>
          <p class="w-full text-sm text-white md:w-2/3 lg:w-1/2 xl:w-1/3 sm:text-base">
            L'eLearning FormaSim, votre plateforme d'eLearning dédiée aux formations médicales
            spécialisées.
          </p>
          <button
            to="/login"
            class="flex items-center gap-2 px-3 py-2 text-sm text-white transition-all rounded-sm cursor-pointer md:px-4 md:py-3 md:text-base w-fit bg-primary hover:bg-primary/90"
            @click="scrollToOverview"
          >
            Découvrir l'eLearning
            <ArrowForwardIcon class="size-4" />
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-col items-center justify-center py-16 bg-white" ref="overview">
      <div class="grid grid-cols-1 gap-8 px-4 max-w-7xl md:grid-cols-2 sm:px-6 lg:px-8">
        <img
          :src="LoginCover"
          alt="Plateforme FormaSim sur un ordinateur portable"
          class="object-cover w-full rounded-lg h-[32rem]"
        />
        <div class="flex flex-col justify-center gap-4">
          <h2 class="text-3xl font-bold text-gray-900">
            En toute simplicité : Apprenez, Pratiquez, Progressez
          </h2>
          <p class="text-lg text-gray-600">
            Notre plateforme intuitive vous permet d'accéder à vos formations médicales en quelques
            clics. Profitez d'une interface moderne et ergonomique, conçue pour optimiser votre
            apprentissage.
          </p>
          <p class="text-lg text-gray-600">
            Avec FormaSim, vous pouvez suivre vos formations où que vous soyez, sur tous vos
            appareils. Notre technologie responsive s'adapte à votre mode de travail pour une
            expérience d'apprentissage optimale.
          </p>
          <a
            href="https://formasim.ch/fr/contact"
            class="flex items-center gap-2 px-6 py-3 mt-4 text-base font-medium text-white transition-all rounded-sm cursor-pointer w-fit bg-primary hover:bg-primary/90"
          >
            Demander un devis <ArrowForwardIcon class="size-4" />
          </a>
        </div>
      </div>
    </div>

    <div class="flex flex-col items-center justify-center py-16 bg-gray-50">
      <div class="w-full px-4 max-w-7xl sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900">FormaSim, qu'est-ce que c'est ?</h2>
        </div>

        <div class="grid grid-cols-1 gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Card 1 -->
          <div class="flex flex-col p-6 bg-white rounded-lg">
            <div class="flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-primary/10">
              <svg
                class="w-6 h-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 class="mb-2 text-lg font-semibold text-gray-900">
              Immersion dans un scénario concret
            </h3>
            <p class="text-gray-600">
              Dans toutes nos formations, vous exercez vos compétences dans des situations médicales
              réelles, avec des simulations en haute fidélité et des patients simulés.
            </p>
          </div>

          <!-- Card 2 -->
          <div class="flex flex-col p-6 bg-white rounded-lg">
            <div class="flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-primary/10">
              <svg
                class="w-6 h-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 class="mb-2 text-lg font-semibold text-gray-900">Formations sur mesure</h3>
            <p class="text-gray-600">
              Toutes nos formations et nos contenus sont développés sur mesure pour répondre à vos
              besoins spécifiques.
            </p>
          </div>

          <!-- Card 3 -->
          <div class="flex flex-col p-6 bg-white rounded-lg">
            <div class="flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-primary/10">
              <svg
                class="w-6 h-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 class="mb-2 text-lg font-semibold text-gray-900">Encadrement professionnel</h3>
            <p class="text-gray-600">
              Vous serez suivi par des professionnels du domaine médical, des experts, des
              formateurs spécialisés en simulation médicale et des ingénieurs pédagogiques et
              paramédicaux.
            </p>
          </div>
        </div>

        <div class="mt-12 text-center">
          <div class="flex flex-col items-center gap-4 p-6 py-16 bg-white rounded-lg">
            <div class="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              <svg
                class="w-8 h-8 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">Nos solutions vous intéressent ?</h3>
            <p class="lg:max-w-1/2 text-neutral-500">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur non ipsa maxime quis.
              Aliquam odio veritatis provident suscipit, eligendi iusto ipsa amet officia cumque.
              Sit cum quibusdam ipsa eveniet laborum.
            </p>
            <a
              href="https://formasim.ch/fr/contact"
              class="inline-flex items-center px-6 py-3 mt-4 text-base font-medium text-white transition-all rounded-sm bg-primary hover:bg-primary/90"
            >
              Demander un devis
            </a>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
