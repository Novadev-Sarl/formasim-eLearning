<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.ts'
import { useRouter, useRoute } from 'vue-router'
import { watchEffect } from 'vue'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

watchEffect(() => {
  if (!auth.user) {
    router.push(`/login?redirect=${route.path}`)
  }
})
</script>

<template>
  <div class="w-full flex justify-center bg-neutral-50">
    <div class="w-full max-w-7xl flex pt-10 items-start">
      <!-- Profile card -->
      <aside class="w-1/4 p-6 bg-white ring-1 ring-neutral-200 rounded-sm">
        <!-- Profile infos -->
        <div class="flex flex-col gap-4 items-center py-4">
          <!-- Profile picture -->
          <div>
            <img
              :src="auth.user?.picture"
              alt="Profile"
              class="size-16 rounded-full shadow-md"
              v-if="auth.user?.picture"
            />
            <div
              v-else
              class="size-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl shadow-md"
            >
              {{ auth.user?.firstname.charAt(0) }}{{ auth.user?.lastname.charAt(0) }}
            </div>
          </div>

          <!-- Profile infos -->
          <div class="flex flex-col items-center">
            <span class="font-semibold text-lg">
              {{ auth.user?.firstname }} {{ auth.user?.lastname }}
            </span>
            <span class="text-sm text-neutral-500">{{ auth.user?.email }}</span>
          </div>

          <!-- Logout button -->
          <button
            class="text-primary cursor-pointer font-semibold"
            @click="
              () => {
                auth.logout()
                router.push('/')
              }
            "
          >
            Se déconnecter
          </button>
        </div>

        <hr class="border-neutral-200 my-4" />

        <div></div>
      </aside>
    </div>
  </div>
</template>
