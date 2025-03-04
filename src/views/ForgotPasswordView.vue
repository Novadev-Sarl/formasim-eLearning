<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
const email = ref('');

const isSending = ref(false);

axios.get(import.meta.env.VITE_API_URL + '/sanctum/csrf-cookie', {
  withCredentials: true,
  withXSRFToken: true,
});

const send = async () => {
  isSending.value = true;
  try {
    await axios.post(import.meta.env.VITE_API_URL + '/api/forgot-password', { email: email.value }, {
      withCredentials: true,
      withXSRFToken: true,
    });
  } catch (error) {
    console.error(error);
  } finally {
    isSending.value = false;
  }
};
</script>

<template>
  <main>
    <form @submit.prevent="send">
      <input type="text" placeholder="Email" v-model="email" />
      <button type="submit" :disabled="isSending" class="text-white action bg-primary">
        {{ isSending ? 'Envoi en cours...' : 'Envoyer' }}
      </button>
    </form>
  </main>
</template>
