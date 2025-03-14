import { useAxios } from '@vueuse/integrations/useAxios'
import { defineStore } from 'pinia'

export const useFormationsStore = defineStore('formations', () => {
  const { data: formations, isFinished: ready } = useAxios('/api/formations')

  return { formations, ready }
})
