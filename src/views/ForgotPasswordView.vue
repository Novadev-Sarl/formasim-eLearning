<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import Logo from '@/assets/icons/formasim.svg';
import ArrowBackIcon from '@/assets/icons/arrow-back.svg';

const email = ref('');
const error = ref<string | null>(null)
const success = ref(false);

const isSending = ref(false);

const send = async () => {
  isSending.value = true;
  success.value = false;
  error.value = null;

  try {
    await axios.post(import.meta.env.VITE_API_URL + '/api/forgot-password', { email: email.value }, {
      withCredentials: true,
      withXSRFToken: true,
    });
  } catch (err) {
    error.value = "Une erreur est survenue lors de l'envoi de l'e-mail de réinitialisation du mot de passe.";
    console.error(err);
    return;
  } finally {
    isSending.value = false;
  }

  success.value = true;
};
</script>

<template>
  <main class="flex flex-col items-center justify-center w-screen h-screen bg-neutral-100">

    <div class="flex flex-col gap-4">
      <RouterLink to="/login" class="flex items-center gap-2 text-primary">
        <ArrowBackIcon class="size-4" />
        Retour au formulaire de connexion
      </RouterLink>

      <div class="flex flex-col max-w-2xl gap-6 p-8 bg-white rounded-md ring w-fit ring-neutral-300">
        <!-- Header -->
        <div>
          <Logo class="h-16" />
        </div>

        <!-- Body -->
        <p class="text-2xl font-semibold">Mot de passe oublié ?</p>
        <p>
          Pas de soucis! Indiquez votre addresse e-mail ci-dessous et nous vous enverrons un lien pour réinitialiser
          votre mot de passe.
          Pensez à vérifier votre boite de réception (et vos spams au besoin).
        </p>

        <form @submit.prevent="send" class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label for="email" class="font-semibold text-neutral-500">Email</label>
            <input type="text" placeholder="Email" v-model="email" />
          </div>

          <div v-if="error" class="text-red-500">
            {{ error }}
          </div>

          <div v-if="success" class="text-green-500">
            L'e-mail de réinitialisation du mot de passe a été envoyé à votre adresse e-mail.
          </div>

          <button type="submit" :disabled="isSending" class="self-end text-white action bg-primary">
            {{ isSending ? 'Envoi en cours...' : 'Réinitialiser le mot de passe &rarr;' }}
          </button>
        </form>
      </div>
    </div>
  </main>
</template>
