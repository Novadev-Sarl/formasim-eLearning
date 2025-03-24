<script setup lang="ts">
import { ref } from 'vue'
import { defaultAxios } from '@/utils/axios'
import Logo from '@/assets/icons/formasim.svg'
import ArrowBackIcon from '@/assets/icons/arrow-back.svg'
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()

const email = ref('')

const isSending = ref(false)
const errored = ref(false)
const sent = ref(false)

const send = async () => {
  isSending.value = true
  errored.value = false
  try {
    await defaultAxios.post(
      import.meta.env.VITE_API_URL + '/api/forgot-password',
      { email: email.value },
      {
        withCredentials: true,
        withXSRFToken: true,
      },
    )
  } catch (err) {
    notificationStore.addNotification(
      "Une erreur est survenue lors de l'envoi de l'e-mail de réinitialisation du mot de passe.",
      'error',
    )
    console.error(err)
    errored.value = true
    return
  } finally {
    isSending.value = false
  }

  sent.value = true

  notificationStore.addNotification(
    "L'e-mail de réinitialisation du mot de passe a été envoyé à votre adresse e-mail.",
    'success',
  )
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
        <p class="text-2xl font-semibold">Mot de passe oublié ?</p>
        <p>
          Pas de soucis! Indiquez votre addresse e-mail ci-dessous et nous vous enverrons un lien
          pour réinitialiser votre mot de passe. Pensez à vérifier votre boite de réception (et vos
          spams au besoin).
        </p>

        <form @submit.prevent="send" class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label for="email" class="font-semibold text-neutral-500">Email</label>
            <input
              type="text"
              placeholder="Email"
              v-model="email"
              :class="{ 'outline-red-500': errored }"
            />
          </div>

          <button
            type="submit"
            :disabled="isSending"
            :class="{ 'opacity-50': isSending }"
            class="self-end text-white action bg-primary"
          >
            {{
              isSending
                ? 'Envoi en cours...'
                : sent
                  ? 'E-mail envoyé'
                  : 'Réinitialiser le mot de passe &rarr;'
            }}
          </button>
        </form>
      </div>
    </div>
  </main>
</template>
