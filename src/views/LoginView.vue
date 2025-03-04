<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';

const auth = useAuthStore();

const email = ref('');
const password = ref('');

const login = async () => {
  await auth.login(email.value, password.value);
};
</script>

<template>
  <main>
    <form @submit.prevent="login"
      class="flex flex-col gap-4 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      <input type="email" v-model="email" placeholder="Email" />
      <input type="password" v-model="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  </main>
</template>
