import type { User } from '@/models/user'
import { useLocalStorage } from '@vueuse/core'
import { destr } from 'destr'
import { defineStore } from 'pinia'
import axios from 'axios'
import { computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = useLocalStorage<User | null>('user', null, {
    serializer: {
      read: destr,
      write: JSON.stringify,
    },
  })

  const login = async (email: string, password: string, remember: boolean) => {
    await axios.get(`${import.meta.env.VITE_API_URL}/sanctum/csrf-cookie`)

    const response = await axios.post<{ user: User }>(
      `${import.meta.env.VITE_API_URL}/api/login`,
      {
        email,
        password,
        remember,
      },
      {
        withCredentials: true,
        withXSRFToken: true,
      },
    )

    user.value = response.data.user

    return true
  }

  const logout = () => {
    user.value = null
    axios.post(
      `${import.meta.env.VITE_API_URL}/api/logout`,
      {},
      {
        withCredentials: true,
        withXSRFToken: true,
      },
    )
  }

  const isLoggedIn = computed(() => user.value !== null)

  return { user, login, logout, isLoggedIn }
})
