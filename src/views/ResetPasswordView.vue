<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import axios, { AxiosError } from 'axios';

const route = useRoute();

const password = ref('');
const passwordConfirmation = ref('');
const loading = ref(false);
const error = ref<null | string>(null);

const resetPassword = async () => {
  loading.value = true;
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
};
</script>

<template>
  <div>
    <form @submit.prevent="resetPassword" class="flex flex-col gap-4">
      <h1 class="text-4xl font-bold">Réinitialiser le mot de passe</h1>

      <div class="flex flex-col gap-2">
        <label for="password">Nouveau mot de passe</label>
        <input type="password" placeholder="Nouveau mot de passe" v-model="password" />
      </div>

      <div class="flex flex-col gap-2">
        <label for="password_confirmation">Confirmation du mot de passe</label>
        <input type="password" placeholder="Confirmation du mot de passe" v-model="passwordConfirmation" />
      </div>

      <span v-if="error !== null" class="text-red-500">
        {{ error }}
      </span>

      <button type="submit" class="text-white action bg-primary">
        Réinitialiser le mot de passe
      </button>
    </form>
  </div>
</template>
