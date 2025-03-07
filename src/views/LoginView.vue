<script setup lang="ts">
import LoginCover from '@/assets/images/login-cover.jpeg'
import Logo from '@/assets/icons/formasim.svg'

import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ref, watchEffect } from 'vue'
import { AxiosError } from 'axios'
import { RouterLink } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

watchEffect(() => {
  if (auth.isLoggedIn) {
    router.push((route.query.redirect as string) || '/dashboard')
  }
})

const email = ref('')
const password = ref('')
const remember = ref(false)

const userError = ref<string | null>(null)

const isLoggingIn = ref(false)

const login = async () => {
  if (isLoggingIn.value) return

  isLoggingIn.value = true
  try {
    await auth.login(email.value, password.value, remember.value)
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        userError.value = 'Email ou mot de passe incorrect'
        return
      }

      if (error.response?.status === 422) {
        userError.value = 'Veuillez vérifier vos informations de connexion'
        return
      }

      userError.value = 'Une erreur est survenue lors de la connexion'
    }
    console.error(error)
  } finally {
    isLoggingIn.value = false
  }
}
</script>

<template>
  <main class="flex flex-row w-screen h-screen">
    <!-- Left cover -->
    <div
      class="relative w-1/2 h-full bg-center bg-cover"
      :style="{ backgroundImage: `url(${LoginCover})` }"
    >
      <div
        class="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-black/80"
      >
        <div
          class="absolute bottom-24 left-[50%] translate-x-[-50%] text-white w-1/2 text-center flex flex-col gap-4 items-center"
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
    <div class="w-1/2">
      <!-- Form -->
      <div class="flex flex-col gap-8 p-24">
        <!-- Header -->
        <div class="flex flex-row items-center justify-between">
          <Logo class="h-12" />
          <RouterLink to="/" class="text-sm underline text-neutral-300">
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
            />
          </div>

          <div class="flex flex-row justify-between">
            <div class="flex flex-row items-center gap-2">
              <input type="checkbox" id="remember" v-model="remember" class="w-4 h-4" />
              <label for="remember">Se souvenir de moi</label>
            </div>

            <RouterLink to="/forgot-password" class="text-sm underline text-neutral-300">
              Mot de passe oublié ?
            </RouterLink>
          </div>

          <span v-if="userError" class="text-red-500">{{ userError }}</span>

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
      <div class="absolute bottom-0 px-24 pb-10 pt-18 bg-neutral-100">
        <p class="font-bold">Informations importantes</p>
        <p>
          Les formations en ligne de FormaSim vous permettent d'obtenir des certificats attestant de
          vos compétences. Cependant, elles ne remplacent pas les formations en présentiel,
          indispensables pour acquérir une pratique encadrée et validée par des experts.
        </p>
        <hr class="mt-16 mb-4 border-neutral-300" />
        <div class="flex flex-row justify-between gap-4 text-sm">
          <div class="flex flex-row gap-2 text-neutral-300">
            <a href="https://formasim.ch/fr/conditions-generales" class="text-primary"
              >Conditions générales d'utilisation</a
            >
            <span>|</span>
            <a href="https://formasim.ch/fr/protection-des-donnees" class="text-primary"
              >Protection des données</a
            >
          </div>
          <span
            >Conçu et développé par
            <a href="https://novadev.ch" class="text-primary">Novadev Sàrl</a></span
          >
        </div>
      </div>
    </div>
  </main>
</template>
