<script setup lang="ts">
import { useFormationsStore, useFormationCategoriesStore } from '@/stores/formations'

import { ProgressSpinner } from 'primevue'

import GridViewIcon from '@/assets/icons/grid-view.svg'
import ListIcon from '@/assets/icons/list.svg'
import SearchIcon from '@/assets/icons/search.svg'
import CourseCard from '@/components/CourseCard.vue'
import FilterIcon from '@/assets/icons/filter-alt.svg'
import FormatListNumberedIcon from '@/assets/icons/format-list-numbered.svg'
import ScheduleIcon from '@/assets/icons/schedule.svg'
import ArrowForwardIcon from '@/assets/icons/arrow-forward.svg'

import { ref, reactive, computed } from 'vue'
import type { Formation, FormationCategory } from '@/models/formation'
import { formatDuration } from '@/utils/time'
import Fuse from 'fuse.js'

const formationsStore = useFormationsStore()
const formationCategoriesStore = useFormationCategoriesStore()

const view = ref<'grid' | 'list'>('grid')

const search = ref('')

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

const formations = ref<Formation[]>([])
const formationCategories = ref<FormationCategory[]>([])

const loading = ref(true)
Promise.all([formationsStore.get(), formationCategoriesStore.get()]).then(([res, res2]) => {
  formations.value = res
  formationCategories.value = res2
  loading.value = false
})

const filteredFormations = computed(() => {
  let initialFormations = formations.value
  if (filters.category.length > 0) {
    initialFormations = initialFormations.filter((formation: Formation) => {
      return (
        formation.formation_category && filters.category.includes(formation.formation_category.id)
      )
    })
  }

  if (filters.lessThan60Min) {
    initialFormations = initialFormations.filter((formation: Formation) => {
      return formation.duration < 60
    })
  }

  if (filters.lessThan30Min) {
    initialFormations = initialFormations.filter((formation: Formation) => {
      return formation.duration < 30
    })
  }

  if (search.value) {
    const fuse = new Fuse(initialFormations, { keys: ['name', 'description'] })
    initialFormations = fuse.search(search.value).map((result) => result.item)
  }

  // TODO: Add certificate filter

  return initialFormations
})
</script>

<template>
  <main class="flex flex-row justify-center mt-4">
    <div class="flex items-center justify-center w-full grow" v-if="loading">
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
            <span>Affichage de {{ filteredFormations.length }} résultats</span>
          </div>
          <div class="flex flex-row gap-2">
            <div class="relative w-full">
              <input
                type="text"
                v-model="search"
                placeholder="Rechercher un cours..."
                class="w-full pl-10"
              />
              <span
                class="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-primary"
              >
                <SearchIcon />
              </span>
            </div>
          </div>
        </div>

        <!-- Content -->
        <template v-if="filteredFormations.length > 0">
          <div
            v-if="view === 'grid'"
            class="grid grid-cols-1 gap-4 p-4 lg:grid-cols-2 xl:grid-cols-3"
          >
            <CourseCard
              v-for="formation in filteredFormations"
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
              v-for="formation in filteredFormations"
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
                    <span class="text-neutral-600">{{ formatDuration(formation.duration) }}</span>
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
        </template>

        <div v-else class="flex flex-col gap-4 p-4">
          <div class="flex flex-col gap-2">
            <h3 class="text-lg font-semibold">Aucune formation trouvée</h3>
            <p class="text-neutral-600">
              Veuillez modifier vos filtres pour trouver une formation correspondante.
            </p>
          </div>
        </div>
      </div>

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
            <li
              v-for="formationCategory in formationCategories"
              :key="formationCategory.id"
              class="flex flex-row items-center gap-2"
            >
              <input
                type="checkbox"
                :id="`formation-${formationCategory.id}`"
                class="w-4 h-4 accent-primary"
                v-model="filters.category"
                :value="formationCategory.id"
              />
              <label
                :for="`formation-${formationCategory.id}`"
                class="text-sm cursor-pointer text-neutral-500"
              >
                <span>{{ formationCategory.name }}</span>
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
