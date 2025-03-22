import type { DetailedFormation, Formation, FormationCategory } from '@/models/formation'
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

  const clear = () => {
    formations.value = null
  }

  return { get, clear }
})

export const useFormationCategoriesStore = defineStore('formationCategories', () => {
  const formationCategories = ref<FormationCategory[] | null>(null)

  const get = async () => {
    if (formationCategories.value) return formationCategories.value

    const { data } = await axios.get<FormationCategory[]>('/api/formation-categories')
    formationCategories.value = data

    return data
  }

  const clear = () => {
    formationCategories.value = null
  }

  return { get, clear }
})

export const useFormationStore = defineStore('formation', () => {
  const formation = ref<Map<number, DetailedFormation>>(new Map())

  const get = async (id: number) => {
    if (formation.value.has(id)) return formation.value.get(id)

    const { data } = await axios.get<DetailedFormation>(`/api/formations/${id}`)
    formation.value.set(id, data)

    return data
  }

  const clear = () => {
    formation.value = new Map()
  }

  return { get, clear }
})
