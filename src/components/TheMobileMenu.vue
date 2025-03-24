<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import LogoutIcon from '@/assets/icons/logout.svg'
import LoginIcon from '@/assets/icons/login.svg'
import { vOnClickOutside } from '@vueuse/components'
import OpenInNewIcon from '@/assets/icons/open-in-new.svg'

const router = useRouter()

const { links } = defineProps<{
  links: {
    label: string
    to: string
    external?: boolean
  }[]
}>()

const navigationMenuShown = defineModel<boolean>()

const headerRef = ref<HTMLElement>()

onMounted(() => {
  headerRef.value = document.getElementsByTagName('header')[0]
})

const auth = useAuthStore()
</script>

<template>
  <Teleport to="body">
    <Transition name="mobile-menu">
      <div
        v-show="navigationMenuShown"
        v-on-click-outside="
          (e) => {
            // If the click on the header, do not close the menu, since it looks like the menu is part of the header
            if ((e.target as HTMLElement).closest('header')) return
            navigationMenuShown = false
          }
        "
        class="fixed left-0 right-0 flex flex-col gap-4 p-4 bg-white rounded-b-lg shadow-xl z-[2]"
        :style="{
          top: (headerRef?.clientHeight ?? 0) + 'px',
        }"
      >
        <div class="flex flex-row items-center justify-between">
          <div
            class="flex flex-row items-center gap-4 cursor-pointer"
            @click="
              () => {
                router.push('/profile')
                navigationMenuShown = false
              }
            "
            v-if="auth.user"
          >
            <img
              :src="auth.user?.image"
              alt="Profile"
              class="grid text-xl text-white rounded-full shadow-md size-12 bg-primary place-items-center"
              v-if="auth.user?.image"
            />
            <div
              v-else
              class="grid text-xl text-white rounded-full shadow-md size-12 bg-primary place-items-center"
            >
              {{ auth.user.firstname.charAt(0) }}{{ auth.user.lastname.charAt(0) }}
            </div>
            <div class="flex flex-col">
              <span class="font-semibold">
                {{ auth.user?.firstname }} {{ auth.user?.lastname }}
              </span>
            </div>
          </div>

          <RouterLink to="/login" v-else class="flex flex-row items-center w-full gap-4">
            <div
              class="grid transition-all rounded-full hover:bg-primary size-12 bg-neutral-300 place-items-center group"
            >
              <LoginIcon
                class="mr-1 transition-all size-6 text-neutral-500 group-hover:text-white"
              />
            </div>

            <span class="text-sm">Se connecter</span>
          </RouterLink>

          <LogoutIcon
            class="mx-2 text-red-500 cursor-pointer size-6"
            @click="
              () => {
                auth.logout()
                navigationMenuShown = false
              }
            "
            v-if="auth.user"
          />
        </div>

        <hr />

        <div class="flex flex-col gap-4">
          <template v-for="link in links" :key="link.label">
            <a
              v-if="link.external"
              :href="link.to"
              target="_blank"
              class="flex flex-row items-center gap-4"
            >
              <span>{{ link.label }}</span>
              <OpenInNewIcon class="size-4" />
            </a>
            <RouterLink
              v-else
              :to="link.to"
              class="flex flex-row items-center gap-4"
              active-class="font-semibold text-primary"
              @click="navigationMenuShown = false"
            >
              <span>{{ link.label }}</span>
            </RouterLink>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  transform: translateY(-150%);
}
</style>
