<script setup lang="ts">
import CallIcon from '@/assets/icons/call.svg'
import MailIcon from '@/assets/icons/mail.svg'
import FacebookF from '@/assets/icons/facebook.svg'
import InstagramIcon from '@/assets/icons/instagram.svg'
import LinkedInIcon from '@/assets/icons/linkedin.svg'
import OpenInNewIcon from '@/assets/icons/open-in-new.svg'
import LogoutIcon from '@/assets/icons/logout.svg'
import LoginIcon from '@/assets/icons/login.svg'
import FormaSimLogo from '@/assets/icons/formasim.svg'

import { ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useAuthStore } from '@/stores/auth'
import { vOnClickOutside } from '@vueuse/components'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const profilePanelShown = ref(false)
const profilePanelRef = ref<HTMLDivElement>()
const profileButtonRef = ref<HTMLDivElement>()

const { width: windowWidth } = useWindowSize()

const toggleProfilePanel = () => {
  profilePanelShown.value = !profilePanelShown.value
}

const logout = () => {
  auth.logout()
}
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <div class="flex flex-row justify-between w-full p-2 max-w-7xl">
      <!-- Contact section -->
      <div class="flex flex-row gap-6 text-sm text-neutral-600">
        <span class="flex flex-row items-center gap-4">
          <CallIcon class="text-primary" />

          <span
            >Tél :
            <a href="tel:+41797897312" class="transition-all text-neutral-400 hover:text-black">
              +41 79 789 73 12
            </a>
          </span>
        </span>

        <span class="flex flex-row items-center gap-4">
          <MailIcon class="text-primary" />

          <span
            >Mail :
            <a
              href="mailto:info@formasim.ch"
              class="transition-all text-neutral-400 hover:text-black"
              >info@formasim.ch</a
            ></span
          >
        </span>
      </div>

      <div class="flex flex-row items-center gap-6 text-sm">
        <a
          href="https://formasim.ch/fr/qui-sommes-nous"
          class="transition-all text-neutral-400 hover:text-primary"
          >Qui sommes-nous ?</a
        >
        <a
          href="https://formasim.ch/fr/clients"
          class="transition-all text-neutral-400 hover:text-primary"
          >Clients</a
        >
        <div class="flex flex-row gap-3 text-neutral-400">
          <!-- Social networks -->
          <a href="https://www.facebook.com/AntoineChoffatFormationsContinuesPourAdultes">
            <FacebookF class="transition-all size-4 text-neutral-400 hover:text-primary" />
          </a>
          <a href="https://www.instagram.com/formasim_sarl/">
            <InstagramIcon class="transition-all size-4 text-neutral-400 hover:text-primary" />
          </a>
          <a href="https://www.linkedin.com/in/antoine-choffat-6821b6a0/">
            <LinkedInIcon class="transition-all size-4 text-neutral-400 hover:text-primary" />
          </a>
        </div>
      </div>
    </div>

    <hr class="w-full h-0.5 border-gray-200" />

    <div class="grid items-center w-full grid-cols-4 p-2 max-w-7xl text-neutral-500">
      <div class="justify-self-start">
        <!-- FormaSim logo -->
        <FormaSimLogo class="my-4 h-14" />
      </div>
      <div class="col-span-2 justify-self-center">
        <!-- NavBar -->
        <nav>
          <ul class="flex flex-row gap-12">
            <li>
              <RouterLink
                to="/"
                class="transition-all hover:text-primary"
                active-class="font-semibold text-primary"
              >
                Accueil
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/formations"
                class="transition-all hover:text-primary"
                active-class="font-semibold text-primary"
                >Mes cours</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/profile"
                class="transition-all hover:text-primary"
                active-class="font-semibold text-primary"
              >
                Mon profil</RouterLink
              >
            </li>
            <li>
              <a
                href="https://formasim.ch/fr/contact"
                class="flex flex-row items-center gap-2 transition-all hover:text-primary"
                target="_blank"
              >
                Contact
                <OpenInNewIcon class="size-4" />
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div class="flex flex-row items-center gap-6 justify-self-end text-neutral-400">
        <!-- Profile elements -->
        <template v-if="auth.user">
          <div
            @click="toggleProfilePanel"
            ref="profileButtonRef"
            class="grid text-xl text-white rounded-full shadow-md cursor-pointer size-12 bg-primary place-items-center"
          >
            {{ auth.user?.firstname.charAt(0) }}{{ auth.user?.lastname.charAt(0) }}
          </div>
          <Teleport to="body">
            <div
              v-show="profilePanelShown"
              ref="profilePanelRef"
              v-on-click-outside="() => (profilePanelShown = false)"
              class="absolute flex flex-col gap-6 p-4 bg-white shadow-md rounded-xl"
              :style="
                profileButtonRef && profilePanelRef
                  ? {
                      // Automatically align the profile panel to the right and bottom of the profile button
                      right:
                        windowWidth -
                        profileButtonRef.offsetLeft -
                        profileButtonRef.clientWidth +
                        'px',
                      top: profileButtonRef.offsetTop + profileButtonRef.clientHeight + 10 + 'px',
                    }
                  : {}
              "
            >
              <!-- Card Header -->
              <div
                class="flex flex-row items-center gap-4 cursor-pointer"
                @click="
                  () => {
                    router.push('/profile')
                    profilePanelShown = false
                  }
                "
              >
                <div
                  class="grid text-xl text-white rounded-full shadow-md size-12 bg-primary place-items-center"
                >
                  {{ auth.user?.firstname.charAt(0) }}{{ auth.user?.lastname.charAt(0) }}
                </div>
                <div class="flex flex-col">
                  <span class="font-semibold">
                    {{ auth.user?.firstname }} {{ auth.user?.lastname }}
                  </span>
                </div>
              </div>

              <!-- Card Body -->
              <div class="flex flex-col items-stretch gap-2">
                <div
                  @click="logout"
                  class="flex flex-row items-center gap-2 text-red-500 cursor-pointer"
                >
                  <LogoutIcon class="size-6" />
                  <span> Déconnexion </span>
                </div>
              </div>
            </div>
          </Teleport>
        </template>
        <template v-else>
          <RouterLink
            to="/login"
            class="grid transition-all rounded-full hover:bg-primary size-12 bg-neutral-300 place-items-center group"
          >
            <LoginIcon class="mr-1 transition-all size-6 text-neutral-500 group-hover:text-white" />
          </RouterLink>
        </template>
      </div>
    </div>
  </div>
</template>
