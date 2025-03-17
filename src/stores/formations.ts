import type { Formation, FormationCategory } from '@/models/formation'
import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFormationsStore = defineStore('formations', () => {
  const formations = ref<Formation[] | null>(null)

  const get = async () => {
    if (formations.value) return formations.value

    const { data } = await axios.get<Formation[]>('/api/formations')
    formations.value = data

    return data
  }

  return { get }
})

export const useFormationCategoriesStore = defineStore('formationCategories', () => {
  const formationCategories = ref<FormationCategory[] | null>(null)

  const get = async () => {
    if (formationCategories.value) return formationCategories.value

    const { data } = await axios.get<FormationCategory[]>('/api/formation-categories')
    formationCategories.value = data

    return data
  }

  return { get }
})

export const useFormationStore = defineStore('formation', () => {
  const formation = ref<Formation | null>(null)

  const get = async (id: number) => {
    if (formation.value) return formation.value

    const { data } = await axios.get<Formation>(`/api/formations/${id}`)
    formation.value = data

    return data
  }

  return { get }
})
