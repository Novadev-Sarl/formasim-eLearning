<script setup lang="ts">
import CallIcon from '@/assets/icons/call.svg'
import MailIcon from '@/assets/icons/mail.svg'
import FacebookF from '@/assets/icons/facebook.svg'
import InstagramIcon from '@/assets/icons/instagram.svg'
import LinkedInIcon from '@/assets/icons/linkedin.svg'
import OpenInNewIcon from '@/assets/icons/open-in-new.svg'
import LoginIcon from '@/assets/icons/login.svg'
import FormaSimLogo from '@/assets/icons/formasim.svg'
import LockIcon from '@/assets/icons/lock.svg'

import TheMobileMenu from '@/components/TheMobileMenu.vue'
import ProfilePanel from '@/components/TheHeader/ProfilePanel.vue'

import { computed, ref, watch, useTemplateRef } from 'vue'
import { useWindowSize, useBreakpoints, breakpointsTailwind, useAnimate } from '@vueuse/core'
import { useAuthStore } from '@/stores/auth'

const breakpoints = useBreakpoints(breakpointsTailwind)

const isDesktop = computed(() => breakpoints.greater('lg').value)
const { width: windowWidth } = useWindowSize()

const auth = useAuthStore()

const profilePanelShown = ref(false)
const profileButton = useTemplateRef('profileButton')

const toggleProfilePanel = () => {
  profilePanelShown.value = !profilePanelShown.value
}

// Prepare burger menu references
const navigationMenuShown = ref(false)
const mobileMenuLine1 = ref<HTMLSpanElement>()
const mobileMenuLine2 = ref<HTMLSpanElement>()
const mobileMenuLine3 = ref<HTMLSpanElement>()

// create burger menu animations
const { play: play1, reverse: reverse1 } = useAnimate(
  mobileMenuLine1,
  [
    { transform: 'translateY(-8px)' },
    { transform: 'translateY(0) rotate(0)' },
    { transform: 'rotate(45deg)' },
  ],
  { duration: 300, fill: 'both', immediate: false },
)

const { play: play2, reverse: reverse2 } = useAnimate(
  mobileMenuLine2,
  [{ opacity: 1 }, { opacity: 0 }, { opacity: 0 }],
  { duration: 300, fill: 'both', immediate: false },
)

const { play: play3, reverse: reverse3 } = useAnimate(
  mobileMenuLine3,
  [
    { transform: 'translateY(8px)' },
    { transform: 'translateY(0) rotate(0)' },
    { transform: 'rotate(-45deg)' },
  ],
  { duration: 300, fill: 'both', immediate: false },
)

/**
 * @var {boolean} played - Whether the burger menu has already been played.
 * This allows to avoid playing the animation twice, while still keeping the animation paused on page load
 */
const played = ref(false)

watch(navigationMenuShown, () => {
  if (!played.value) {
    play1()
    play2()
    play3()
    played.value = true
  } else {
    reverse1()
    reverse2()
    reverse3()
  }
})

const profilePanelTop = computed(() => {
  if (!profileButton.value) return 0
  return profileButton.value.offsetTop + profileButton.value.clientHeight + 10
})

const profilePanelRight = computed(() => {
  if (!profileButton.value) return 0
  if (!isDesktop.value) return 0
  return windowWidth.value - profileButton.value.offsetLeft - profileButton.value.clientWidth
})

const links = [
  { label: 'Accueil', external: false, to: '/', authenticated: false },
  { label: 'Mes cours', external: false, to: '/formations', authenticated: true },
  { label: 'Mon profil', external: false, to: '/profile', authenticated: true },
  { label: 'Contact', external: true, to: 'https://formasim.ch/fr/contact' },
]
</script>

<template>
  <div class="flex flex-col items-center w-full" ref="header">
    <!-- Contact section -->
    <div class="flex-row justify-between hidden w-full p-2 xl:flex max-xl:px-8 max-w-7xl">
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

    <div
      class="flex flex-row items-center justify-between w-full grid-cols-4 p-2 lg:grid max-xl:px-8 max-xl:py-6 max-w-7xl text-neutral-500"
    >
      <!-- FormaSim logo -->
      <RouterLink to="/" class="flex justify-self-start">
        <FormaSimLogo class="h-10 my-2 lg:my-4 lg:h-14" />
      </RouterLink>

      <!-- NavBar -->
      <div class="hidden col-span-2 justify-self-center lg:flex">
        <nav>
          <ul class="flex flex-row gap-12">
            <li v-for="link in links" :key="link.label">
              <a
                v-if="link.external"
                :href="link.to"
                target="_blank"
                class="flex flex-row items-center gap-2 transition-all hover:text-primary"
              >
                <span>
                  {{ link.label }}
                </span>
                <OpenInNewIcon class="size-4" />
              </a>
              <RouterLink
                v-else
                :to="link.to"
                class="flex flex-row items-center gap-2 transition-all hover:text-primary"
                active-class="font-semibold text-primary"
              >
                {{ link.label }}
                <LockIcon v-if="link.authenticated && !auth.user" class="size-4" />
              </RouterLink>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Profile elements -->
      <div
        class="flex-row items-center hidden gap-6 max-lg:col-start-1 lg:flex lg:justify-self-end text-neutral-400"
      >
        <template v-if="auth.user">
          <img
            :src="auth.user?.image"
            alt="Profile"
            class="grid text-xl text-white rounded-full shadow-md cursor-pointer size-12 bg-primary place-items-center"
            ref="profileButton"
            @click="toggleProfilePanel"
            v-if="auth.user?.image"
          />
          <div
            v-else
            @click="toggleProfilePanel"
            ref="profileButton"
            class="grid text-xl text-white rounded-full shadow-md cursor-pointer size-12 bg-primary place-items-center"
          >
            {{ auth.user?.firstname.charAt(0) }}{{ auth.user?.lastname.charAt(0) }}
          </div>
          <ProfilePanel
            v-if="profilePanelShown"
            :top="profilePanelTop"
            :right="profilePanelRight"
          />
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

      <!-- Burger menu -->
      <div class="relative lg:hidden">
        <button
          @click.capture.prevent="() => (navigationMenuShown = !navigationMenuShown)"
          class="relative flex flex-col items-center justify-center transition-colors rounded-md size-8 burger-menu"
          :class="{ open: navigationMenuShown }"
          aria-label="Menu"
        >
          <span ref="mobileMenuLine1" class="absolute top-1/2 block w-6 h-0.5 bg-black"></span>
          <span ref="mobileMenuLine2" class="absolute top-1/2 block w-6 h-0.5 bg-black"></span>
          <span ref="mobileMenuLine3" class="absolute top-1/2 block w-6 h-0.5 bg-black"></span>
        </button>
      </div>

      <TheMobileMenu v-model="navigationMenuShown" :links="links" />
    </div>
  </div>
</template>
