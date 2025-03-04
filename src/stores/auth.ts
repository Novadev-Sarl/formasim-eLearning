import type { User } from '@/models/user'
import { useLocalStorage } from '@vueuse/core'
import { destr } from 'destr'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const user = useLocalStorage<User | null>('user', null, {
    serializer: {
      read: destr,
      write: JSON.stringify,
    },
  })

  const login = async (email: string, password: string) => {
    await axios.get(`${import.meta.env.VITE_API_URL}/sanctum/csrf-cookie`)

    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/login`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
        withXSRFToken: true,
      },
    )

    return true
  }

  return { user, login }
})
