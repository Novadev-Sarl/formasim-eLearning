<script setup lang="ts">
import LoginCover from '@/assets/images/login-cover.jpeg'
import Logo from '@/assets/icons/formasim.svg'

import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import { ref, watchEffect } from 'vue'
import { AxiosError } from 'axios'
import { RouterLink } from 'vue-router'

const auth = useAuthStore()
const notificationStore = useNotificationStore()
const router = useRouter()
const route = useRoute()
const errored = ref(false)

watchEffect(() => {
  if (auth.isLoggedIn) {
    router.push((route.query.redirect as string) || '/dashboard')
  }
})

const email = ref('')
const password = ref('')
const remember = ref(false)

const isLoggingIn = ref(false)

const login = async () => {
  if (isLoggingIn.value) return

  isLoggingIn.value = true
  errored.value = false
  try {
    await auth.login(email.value, password.value, remember.value)
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        notificationStore.addNotification('Email ou mot de passe incorrect', 'error')
        errored.value = true
        return
      }

      if (error.response?.status === 422) {
        notificationStore.addNotification(
          'Veuillez vérifier vos informations de connexion',
          'error',
        )
        errored.value = true
        return
      }

      notificationStore.addNotification('Une erreur est survenue lors de la connexion', 'error')
    }
    console.error(error)
  } finally {
    isLoggingIn.value = false
  }
}
</script>

<template>
  <main class="flex flex-row 2xl:justify-around justify-stretch">
    <!-- Left cover -->
    <div
      class="relative hidden h-screen bg-center bg-cover 2xl:block grow"
      :style="{ backgroundImage: `url(${LoginCover})` }"
    >
      <div
        class="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-black/80"
      >
        <div
          class="absolute bottom-24 left-[50%] translate-x-[-50%] text-white w-lg max-w-full text-center flex flex-col gap-4 items-center"
        >
          <h1 class="text-4xl font-bold text-center">Bienvenue sur l'eLearning FormaSim</h1>
          <p>
            L'eLearning FormaSim, votre plateforme d'eLearning dédiée aux formations médicales
            spécialisées
          </p>
          <button class="text-white bg-black hover:bg-neutral-950 hover:shadow-md action">
            Demander un accès
          </button>
        </div>
      </div>
    </div>

    <!-- Form container -->
    <div
      class="flex flex-col justify-between w-full h-screen 2xl:w-1/2 2xl:min-w-4xl shrink-0 2xl:overflow-y-scroll"
    >
      <!-- Form -->
      <div class="flex flex-col gap-8 p-8 md:p-24">
        <!-- Header -->
        <div class="flex flex-row items-center justify-between">
          <RouterLink to="/">
            <Logo class="h-12" />
          </RouterLink>

          <RouterLink to="/" class="hidden text-sm underline text-neutral-300 md:block">
            Retour à la page d'accueil
          </RouterLink>
        </div>

        <h2 class="mt-8 text-3xl font-bold">Connectez-vous à votre compte</h2>
        <form class="flex flex-col gap-4" @submit.prevent="login">
          <div class="flex flex-col gap-2">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              v-model="email"
              class="w-full"
              placeholder="Entrez votre email"
              :class="{ 'outline-red-500 outline-1 animate-shake': errored }"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              v-model="password"
              class="w-full"
              placeholder="Entrez votre mot de passe"
              :class="{ 'outline-red-500 outline-1 animate-shake': errored }"
            />
          </div>

          <div class="flex flex-col justify-between gap-4 md:flex-row">
            <div class="flex flex-row items-center gap-2">
              <input type="checkbox" id="remember" v-model="remember" class="w-4 h-4" />
              <label for="remember">Se souvenir de moi</label>
            </div>

            <RouterLink to="/forgot-password" class="text-sm underline text-neutral-300">
              Mot de passe oublié ?
            </RouterLink>
          </div>

          <button
            type="submit"
            class="my-4 text-white action bg-primary disabled:opacity-50 disabled:cursor-auto"
            :disabled="isLoggingIn"
          >
            {{ isLoggingIn ? 'Connexion en cours...' : 'Se connecter' }}
          </button>
        </form>
      </div>

      <!-- Footer -->
      <div class="p-8 pb-10 md:px-24 md:pt-18 bg-neutral-100">
        <p class="font-bold">Informations importantes</p>
        <p>
          Les formations en ligne de FormaSim vous permettent d'obtenir des certificats attestant de
          vos compétences. Cependant, elles ne remplacent pas les formations en présentiel,
          indispensables pour acquérir une pratique encadrée et validée par des experts.
        </p>
        <hr class="mt-16 mb-4 border-neutral-300" />
        <div class="flex flex-col justify-between gap-4 text-sm md:items-center md:flex-row">
          <div class="flex flex-col gap-2 lg:flex-row text-neutral-300">
            <a href="https://formasim.ch/fr/conditions-generales" class="text-primary">
              Conditions générales d'utilisation
            </a>
            <span class="hidden lg:block">|</span>
            <a href="https://formasim.ch/fr/protection-des-donnees" class="text-primary">
              Protection des données
            </a>
          </div>
          <span>
            Conçu et développé par
            <a href="https://novadev.ch" class="text-primary">Novadev Sàrl</a>
          </span>
        </div>
      </div>
    </div>
  </main>
</template>
