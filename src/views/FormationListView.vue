<script setup lang="ts">
import { useFormationsStore } from '@/stores/formations'
import { useAuthStore } from '@/stores/auth'
import { useRoute, useRouter } from 'vue-router'

import { ProgressSpinner } from 'primevue'

import GridViewIcon from '@/assets/icons/grid-view.svg'
import ListIcon from '@/assets/icons/list.svg'
import SearchIcon from '@/assets/icons/search.svg'
import CourseCard from '@/components/CourseCard.vue'
import FilterIcon from '@/assets/icons/filter-alt.svg'
import FormatListNumberedIcon from '@/assets/icons/format-list-numbered.svg'
import ScheduleIcon from '@/assets/icons/schedule.svg'
import ArrowForwardIcon from '@/assets/icons/arrow-forward.svg'

import { ref, reactive } from 'vue'

const formationsStore = useFormationsStore()
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const view = ref<'grid' | 'list'>('grid')

if (!authStore.isLoggedIn) {
  router.replace(`/login?redirect=${route.path}`)
}

const filters = reactive({
  category: [] as number[],
  certificate: false,
  lessThan60Min: false,
  lessThan30Min: false,
})

const resetFilters = () => {
  filters.category = []
  filters.certificate = false
  filters.lessThan60Min = false
  filters.lessThan30Min = false
}
</script>

<template>
  <main class="flex flex-row justify-center mt-4">
    <div class="flex items-center justify-center w-full grow" v-if="!formationsStore.ready">
      <ProgressSpinner style="stroke: var(--color-primary)" />
    </div>

    <div v-else class="flex flex-col-reverse md:flex-row max-w-7xl grow">
      <div class="flex flex-col grow max-md:px-4">
        <!-- Header-->
        <div
          class="flex flex-col items-stretch justify-between w-full gap-2 p-4 lg:items-center lg:flex-row"
        >
          <div
            class="flex flex-row items-center justify-between gap-2 text-sm font-semibold lg:justify-start"
          >
            <div class="flex flex-row items-center gap-2">
              <button
                class="p-1 transition-colors rounded-sm cursor-pointer ring-1 ring-gray-200"
                :class="{
                  'bg-primary text-white': view === 'grid',
                  'bg-white text-black': view !== 'grid',
                }"
                @click="view = 'grid'"
              >
                <GridViewIcon />
              </button>
              <button
                class="p-1 transition-colors rounded-sm cursor-pointer ring-1 ring-gray-200"
                :class="{
                  'bg-primary text-white': view === 'list',
                  'bg-white text-black': view !== 'list',
                }"
                @click="view = 'list'"
              >
                <ListIcon />
              </button>
            </div>
            <span>Affichage de {{ formationsStore.formations.length }} résultats</span>
          </div>
          <div class="flex flex-row gap-2">
            <div class="relative w-full">
              <!-- TODO: Add search input -->
              <input type="text" placeholder="Rechercher un cours..." class="w-full pl-10" />
              <span
                class="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-primary"
              >
                <SearchIcon />
              </span>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div
          v-if="view === 'grid'"
          class="grid grid-cols-1 gap-4 p-4 lg:grid-cols-2 xl:grid-cols-3"
        >
          <CourseCard
            v-for="formation in formationsStore.formations"
            :key="formation.id"
            :formation="formation"
          >
            <template #footer>
              <RouterLink
                :to="`/formations/${formation.id}`"
                class="py-3 font-semibold text-center bg-white border action border-primary text-primary hover:bg-primary hover:text-white"
              >
                Démarrer le cours
              </RouterLink>
            </template>
          </CourseCard>
        </div>

        <div v-else class="flex flex-col gap-4 p-4">
          <RouterLink
            v-for="formation in formationsStore.formations"
            :key="formation.id"
            :to="`/formations/${formation.id}`"
            class="flex flex-row items-center justify-between gap-4 p-4 bg-white rounded-sm cursor-pointer ring-1 ring-gray-200 group"
          >
            <div class="flex flex-col gap-2">
              <h3 class="text-lg font-semibold">{{ formation.name }}</h3>
              <div class="flex flex-row gap-2">
                <div class="flex flex-row gap-2">
                  <FormatListNumberedIcon class="size-6 text-primary" />
                  <span class="text-neutral-600">10 chapitres</span>
                </div>

                <div class="flex flex-row gap-2 mr-5">
                  <ScheduleIcon class="size-6 text-primary" />
                  <span class="text-neutral-600">3h30</span>
                </div>
              </div>
            </div>

            <button
              class="flex items-center justify-center p-2 transition-colors bg-white border rounded-sm size-12 border-primary text-primary group-hover:bg-primary group-hover:text-white"
            >
              <ArrowForwardIcon class="size-6" />
            </button>
          </RouterLink>
        </div>
      </div>

      <!-- TODO: Add filters functionnality -->
      <aside class="flex flex-col gap-4 max-md:px-8 max-xl:md:pr-8 min-w-xs">
        <!-- Filter header -->
        <div class="flex flex-row items-center justify-between py-4 h-[96px]">
          <span class="flex flex-row items-center gap-2 text-xl font-semibold">
            <FilterIcon class="size-5" />
            Filtres
          </span>

          <button class="text-sm cursor-pointer text-neutral-500" @click="resetFilters">
            Réinitialiser
          </button>
        </div>

        <!-- Category filter -->
        <div class="flex flex-col gap-2 p-6 bg-white rounded-sm ring-1 ring-gray-200">
          <span class="text-sm font-semibold">Catégorie du cours</span>
          <ul class="flex flex-col gap-4 py-2">
            <!-- TODO: Add dynamic categories -->
            <li v-for="i in 10" :key="i" class="flex flex-row items-center gap-2">
              <input
                type="checkbox"
                :id="`formation-${i}`"
                class="w-4 h-4 accent-primary"
                :checked="filters.category.includes(i)"
                @change="
                  (newVal) =>
                    newVal
                      ? filters.category.push(i)
                      : filters.category.splice(filters.category.indexOf(i), 1)
                "
              />
              <label :for="`formation-${i}`" class="text-sm cursor-pointer text-neutral-500">
                <span>Formation {{ i }}</span>
              </label>
            </li>
          </ul>
        </div>

        <!-- Misc filter -->
        <div class="flex flex-col gap-2 p-6 bg-white rounded-sm ring-1 ring-gray-200">
          <span class="text-sm font-semibold">Spécificités</span>
          <ul class="flex flex-col gap-4 py-2">
            <li class="flex flex-row items-center gap-2">
              <input
                type="checkbox"
                id="certificate"
                class="w-4 h-4 accent-primary"
                v-model="filters.certificate"
              />
              <label for="certificate" class="text-sm cursor-pointer text-neutral-500">
                <span>Donne droit à un certificat</span>
              </label>
            </li>
            <li class="flex flex-row items-center gap-2">
              <input
                type="checkbox"
                id="less-60-min"
                class="w-4 h-4 accent-primary"
                v-model="filters.lessThan60Min"
              />
              <label for="less-60-min" class="text-sm cursor-pointer text-neutral-500">
                <span>Moins de 60 minutes</span>
              </label>
            </li>
            <li class="flex flex-row items-center gap-2">
              <input
                type="checkbox"
                id="less-30-min"
                class="w-4 h-4 accent-primary"
                v-model="filters.lessThan30Min"
              />
              <label for="less-30-min" class="text-sm cursor-pointer text-neutral-500">
                <span>Moins de 30 minutes</span>
              </label>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </main>
</template>
