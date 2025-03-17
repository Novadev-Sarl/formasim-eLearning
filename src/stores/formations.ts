import type { Formation } from '@/models/formation'
import { useAxios } from '@vueuse/integrations/useAxios'
import { defineStore } from 'pinia'

export const useFormationsStore = defineStore('formations', () => {
  const { data: formations, isFinished: ready } = useAxios<Formation[]>('/api/formations')

  return { formations, ready }
})

export const useFormationCategoriesStore = defineStore('formationCategories', () => {
  const { data: formationCategories, isFinished: ready } = useAxios('/api/formation-categories')

  return { formationCategories, ready }
})
