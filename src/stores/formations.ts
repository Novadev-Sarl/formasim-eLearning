import type { DetailedFormation, Formation, FormationCategory } from '@/models/formation'
import { authenticatedAxios } from '@/utils/axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFormationsStore = defineStore('formations', () => {
  /**
   * List of available formations. Is automatically updated when the `get` function is called,
   * then returned for each subsequent call.
   */
  const formations = ref<Formation[] | null>(null)

  /**
   * Get the list of available formations.
   * @returns The list of available formations.
   */
  const get = async () => {
    if (formations.value) return formations.value

    const { data } = await authenticatedAxios.get<Formation[]>('/api/formations')
    formations.value = data

    return data
  }

  /**
   * Clear the list of available formations.
   */
  const clear = () => {
    formations.value = null
  }

  return { get, clear }
})

export const useFormationCategoriesStore = defineStore('formationCategories', () => {
  /**
   * List of available formation categories. Is automatically updated when the `get` function is called,
   * then returned for each subsequent call.
   */
  const formationCategories = ref<FormationCategory[] | null>(null)

  /**
   * Get the list of available formation categories.
   * @returns The list of available formation categories.
   */
  const get = async () => {
    if (formationCategories.value) return formationCategories.value

    const { data } = await authenticatedAxios.get<FormationCategory[]>('/api/formation-categories')
    formationCategories.value = data

    return data
  }

  /**
   * Clear the list of available formation categories.
   */
  const clear = () => {
    formationCategories.value = null
  }

  return { get, clear }
})

export const useFormationStore = defineStore('formation', () => {
  /**
   * Details of a specific formation. Is automatically updated when the `get` function is called,
   * then returned for each subsequent call.
   *
   * Formations are stored in a HashMap, indexed by their ID.
   */
  const formation = ref<Map<number, DetailedFormation>>(new Map())

  /**
   * Get the details of a specific formation.
   * @param id - The ID of the formation to get.
   * @param force - Whether to force the re-fetch of the formation.
   * @returns The details of the formation.
   */
  const get = async (id: number, force = false) => {
    if (formation.value.has(id) && !force) return formation.value.get(id)!

    const { data } = await authenticatedAxios.get<DetailedFormation>(`/api/formations/${id}`)
    formation.value.set(id, data)

    return data
  }

  /**
   * Clear the details of all formations.
   */
  const clear = () => {
    formation.value = new Map()
  }

  return { get, clear }
})
