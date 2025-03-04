<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import axios, { AxiosError } from 'axios';
import ArrowBackIcon from '@/components/icons/ArrowBackIcon.vue';
import Logo from '@/assets/icons/formasim.svg';

const route = useRoute();

const password = ref('');
const passwordConfirmation = ref('');
const loading = ref(false);
const error = ref<null | string>(null);
const success = ref(false);

const resetPassword = async () => {
  loading.value = true;
  error.value = null;
  success.value = false;

  try {
    await axios.post(import.meta.env.VITE_API_URL + '/api/reset-password', {
      password: password.value,
      password_confirmation: passwordConfirmation.value,
      token: route.query.token,
    }, {
      withCredentials: true,
      withXSRFToken: true,
    });
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.status === 422) {
        error.value = err.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer plus tard.';
        console.error(err.response?.data?.errors);
        return;
      }

      error.value = `Une erreur est survenue (${err.response?.data?.message}). Veuillez réessayer plus tard.`;
      console.error(err.response?.data?.message);

      return;
    }

    error.value = 'Une erreur est survenue. Veuillez réessayer plus tard.';
    console.error(err)
  } finally {
    loading.value = false;
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

        <p class="text-2xl font-semibold">Définissez un nouveau mot de passe</p>

        <p>
          Sélectionnez un nouveau mot de passe sécurisé et confirmez-le pour finaliser la réinitialisation de votre
          accès
        </p>

        <form @submit.prevent="resetPassword" class="flex flex-col gap-4">

          <div class="flex flex-col gap-2">
            <label for="password" class="font-semibold text-neutral-500">Nouveau mot de passe</label>
            <input type="password" placeholder="Nouveau mot de passe" v-model="password" />
          </div>

          <div class="flex flex-col gap-2">
            <label for="password_confirmation" class="font-semibold text-neutral-500">Confirmation du mot de
              passe</label>
            <input type="password" placeholder="Confirmation du mot de passe" v-model="passwordConfirmation" />
          </div>

          <span v-if="error !== null" class="text-red-500">
            {{ error }}
          </span>

          <span v-if="success" class="text-green-500">
            Le mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.
          </span>

          <button type="submit" :disabled="loading" class="self-end text-white action bg-primary">
            {{ loading ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe &rarr;' }}
          </button>
        </form>
      </div>
    </div>
  </main>
</template>
