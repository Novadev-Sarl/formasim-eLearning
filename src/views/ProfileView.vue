<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.ts'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

import DashboardIcon from '@/assets/icons/dashboard.svg'
import AccountCircleIcon from '@/assets/icons/account-circle.svg'
import SchoolIcon from '@/assets/icons/school.svg'
import LicenseIcon from '@/assets/icons/license.svg'

import TheDashboard from './ProfileView/ProfileDashboard.vue'
import ProfileInformations from './ProfileView/ProfileInformations.vue'
import CurrentFormations from './ProfileView/CurrentFormations.vue'
import CertificatesList from './ProfileView/CertificatesList.vue'

const auth = useAuthStore()
const router = useRouter()

/**
 * @var selectedTab The current active tab of the profile view.
 */
const selectedTab = ref(0)

/**
 * @var tabs The tabs of the profile view.
 */
const tabs = [
  {
    label: 'Tableau de bord',
    icon: DashboardIcon,
    content: TheDashboard,
  },
  {
    label: 'Informations personnelles',
    icon: AccountCircleIcon,
    content: ProfileInformations,
  },
  {
    label: 'Cours actifs/suivis',
    icon: SchoolIcon,
    content: CurrentFormations,
  },
  {
    label: 'Mes certificats',
    icon: LicenseIcon,
    content: CertificatesList,
  },
]
</script>

<template>
  <div class="flex justify-center w-full p-4 mt-4 bg-neutral-50">
    <div
      class="flex flex-col items-stretch w-full gap-12 xl:pt-10 xl:items-start xl:flex-row max-w-7xl"
    >
      <!-- Profile card -->
      <aside class="w-full p-6 bg-white rounded-sm xl:w-1/4 shrink-0 ring-1 ring-neutral-100">
        <!-- Profile infos -->
        <div class="flex flex-col items-center gap-4 py-4">
          <!-- Profile picture -->
          <div>
            <img
              :src="auth.user?.image"
              alt="Profile"
              class="object-cover rounded-full shadow-md size-16"
              v-if="auth.user?.image"
            />
            <div
              v-else
              class="flex items-center justify-center text-2xl text-white rounded-full shadow-md size-16 bg-primary"
            >
              {{ auth.user?.firstname.charAt(0) }}{{ auth.user?.lastname.charAt(0) }}
            </div>
          </div>

          <!-- Profile infos -->
          <div class="flex flex-col items-center">
            <span class="text-lg font-semibold">
              {{ auth.user?.firstname }} {{ auth.user?.lastname }}
            </span>
            <span class="text-sm text-neutral-500">{{ auth.user?.email }}</span>
          </div>

          <!-- Logout button -->
          <button
            class="font-semibold cursor-pointer text-primary"
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

        <hr class="my-4 border-neutral-200" />

        <!-- Tabs -->
        <div class="py-4">
          <nav>
            <ul class="flex flex-col justify-start gap-5 lg:flex-row lg:justify-center xl:flex-col">
              <li v-for="(tab, index) in tabs" :key="tab.label">
                <button
                  class="flex flex-row items-center gap-2 transition-all duration-300 cursor-pointer hover:text-black/60"
                  @click="selectedTab = index"
                  :class="{ 'text-primary hover:text-primary': selectedTab === index }"
                >
                  <component :is="tab.icon" />
                  {{ tab.label }}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      <div class="flex flex-col items-stretch gap-4 grow">
        <h1 class="text-2xl font-bold">{{ tabs[selectedTab].label }}</h1>

        <!-- Tab content with suspense and loading indication -->
        <Suspense timeout="0">
          <component :is="tabs[selectedTab].content" />

          <template #fallback>
            <div class="flex items-center justify-center grow">
              <div class="flex flex-col items-center gap-4 p-8 rounded-lg ring-1 ring-neutral-100">
                <div
                  class="w-8 h-8 border-4 rounded-full border-primary/20 border-t-primary animate-spin"
                ></div>
                <span class="text-base font-medium text-neutral-600">Chargement...</span>
              </div>
            </div>
          </template>
        </Suspense>
      </div>
    </div>
  </div>
</template>
