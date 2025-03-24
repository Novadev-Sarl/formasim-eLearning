<script setup lang="ts">
import LogoutIcon from '@/assets/icons/logout.svg'

import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

defineEmits<{
  (e: 'close'): void
}>()

defineProps<{
  top: number
  right?: number
}>()

const router = useRouter()
const auth = useAuthStore()
</script>

<template>
  <Teleport to="body">
    <div
      ref="profilePanel"
      v-on-click-outside="$emit('close')"
      class="fixed flex flex-col gap-6 p-4 bg-white shadow-md rounded-xl max-lg:left-4 max-lg:right-4 ring-1 ring-neutral-200 z-[4]"
      :style="{
        top: top + 'px',
        right: right ? right + 'px' : undefined,
      }"
    >
      <!-- Card Header -->
      <div
        class="flex flex-row items-center gap-4 cursor-pointer"
        @click="
          () => {
            router.push('/profile')
            $emit('close')
          }
        "
      >
        <img
          :src="auth.user?.image"
          alt="Profile"
          class="rounded-full shadow-md size-12"
          v-if="auth.user?.image"
        />
        <div
          class="grid text-xl text-white rounded-full shadow-md size-12 bg-primary place-items-center"
          v-else
        >
          {{ auth.user?.firstname.charAt(0) }}{{ auth.user?.lastname.charAt(0) }}
        </div>
        <div class="flex flex-col">
          <span class="font-semibold"> {{ auth.user?.firstname }} {{ auth.user?.lastname }} </span>
        </div>
      </div>

      <!-- Card Body -->
      <div class="flex flex-col items-stretch gap-2">
        <div
          @click="auth.logout"
          class="flex flex-row items-center gap-2 text-red-500 cursor-pointer"
        >
          <LogoutIcon class="size-6" />
          <span> Déconnexion </span>
        </div>
      </div>
    </div>
  </Teleport>
</template>
