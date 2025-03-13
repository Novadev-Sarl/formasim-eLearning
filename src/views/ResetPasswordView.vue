<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import axios, { AxiosError } from 'axios'
import Logo from '@/assets/icons/formasim.svg'
import ArrowBackIcon from '@/assets/icons/arrow-back.svg'
import { useNotificationStore } from '@/stores/notification'
import { useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const notificationStore = useNotificationStore()

const password = ref('')
const passwordConfirmation = ref('')
const loading = ref(false)
const errored = ref(false)

const resetPassword = async () => {
  loading.value = true
  errored.value = false

  try {
    await axios.post(
      import.meta.env.VITE_API_URL + '/api/reset-password',
      {
        password: password.value,
        password_confirmation: passwordConfirmation.value,
        token: route.query.token,
      },
      {
        withCredentials: true,
        withXSRFToken: true,
      },
    )
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.status === 422) {
        notificationStore.addNotification(
          err.response?.data?.message ||
            'Une erreur est survenue. Veuillez vérifier vos informations.',
          'error',
        )
        console.error(err.response?.data?.errors)
        errored.value = true
        return
      }

      notificationStore.addNotification(
        `Une erreur est survenue (${err.response?.data?.message}). Veuillez réessayer plus tard.`,
        'error',
      )
      console.error(err.response?.data?.message)
      errored.value = true
      return
    }

    notificationStore.addNotification(
      'Une erreur est survenue. Veuillez réessayer plus tard.',
      'error',
    )
    errored.value = true
    console.error(err)
  } finally {
    loading.value = false
  }

  notificationStore.addNotification(
    'Le mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.',
    'success',
  )

  router.push('/login')
}
</script>

<template>
  <main class="flex flex-col items-center justify-center w-screen h-screen bg-neutral-100">
    <div class="flex flex-col gap-4">
      <RouterLink to="/login" class="flex items-center gap-2 text-primary">
        <ArrowBackIcon class="size-4" />
        Retour au formulaire de connexion
      </RouterLink>

      <div
        class="flex flex-col max-w-2xl gap-6 p-8 bg-white rounded-md ring w-fit ring-neutral-300"
      >
        <!-- Header -->
        <div>
          <Logo class="h-16" />
        </div>

        <!-- Body -->

        <p class="text-2xl font-semibold">Définissez un nouveau mot de passe</p>

        <p>
          Sélectionnez un nouveau mot de passe sécurisé et confirmez-le pour finaliser la
          réinitialisation de votre accès
        </p>

        <form @submit.prevent="resetPassword" class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label for="password" class="font-semibold text-neutral-500"
              >Nouveau mot de passe</label
            >
            <input
              type="password"
              placeholder="Nouveau mot de passe"
              v-model="password"
              :class="{ 'outline-red-500': errored }"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="password_confirmation" class="font-semibold text-neutral-500"
              >Confirmation du mot de passe</label
            >
            <input
              type="password"
              placeholder="Confirmation du mot de passe"
              v-model="passwordConfirmation"
              :class="{ 'outline-red-500': errored }"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            :class="{ 'opacity-50': loading }"
            class="self-end text-white action bg-primary"
          >
            {{ loading ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe &rarr;' }}
          </button>
        </form>
      </div>
    </div>
  </main>
</template>
