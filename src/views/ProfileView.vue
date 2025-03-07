<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.ts'
import { useRouter, useRoute } from 'vue-router'
import { watchEffect, ref } from 'vue'

import DashboardIcon from '@/assets/icons/dashboard.svg'
import AccountCircleIcon from '@/assets/icons/account-circle.svg'
import SchoolIcon from '@/assets/icons/school.svg'
import LicenseIcon from '@/assets/icons/license.svg'

import TheDashboard from './ProfileView/TheDashboard.vue'
import ProfileInformations from './ProfileView/ProfileInformations.vue'
import CurrentFormations from './ProfileView/CurrentFormations.vue'
import CertificatesList from './ProfileView/CertificatesList.vue'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

watchEffect(() => {
  if (!auth.user) {
    router.replace(`/login?redirect=${route.path}`)
  }
})

const selectedTab = ref(0)
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
  <div class="flex justify-center w-full bg-neutral-50">
    <div class="flex items-start w-full gap-12 pt-10 max-w-7xl">
      <!-- Profile card -->
      <aside class="w-1/4 p-6 bg-white rounded-sm ring-1 ring-neutral-200">
        <!-- Profile infos -->
        <div class="flex flex-col items-center gap-4 py-4">
          <!-- Profile picture -->
          <div>
            <img
              :src="auth.user?.picture"
              alt="Profile"
              class="rounded-full shadow-md size-16"
              v-if="auth.user?.picture"
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
            <ul class="flex flex-col gap-5">
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

      <!-- Tab content -->
      <component :is="tabs[selectedTab].content" class="grow" />
    </div>
  </div>
</template>
