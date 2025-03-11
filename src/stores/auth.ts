import type { User } from '@/models/user'
import { useLocalStorage } from '@vueuse/core'
import { destr } from 'destr'
import { defineStore } from 'pinia'
import axios from 'axios'
import { computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  /**
   * The logged in user.
   * By using useLocalStorage, we can persist the user in the browser,
   * namely in the Local Storage.
   * This way, the user is logged in even after a page reload.
   */
  const user = useLocalStorage<User | null>('user', null, {
    serializer: {
      read: destr,
      write: JSON.stringify,
    },
  })

  /**
   * Login the user.
   * @param email - The email of the user.
   * @param password - The password of the user.
   * @param remember - Whether to remember the user.
   * @returns Whether the login was successful.
   */
  const login = async (email: string, password: string, remember: boolean) => {
    // first, make sure that the CSRF token is set
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

  /**
   * Logout the user.
   */
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

  const updateUser = async (input: Partial<User> & { password?: string }) => {
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/user`, input, {
      withCredentials: true,
      withXSRFToken: true,
    })

    user.value = response.data.user
  }

  /**
   * Whether the user is logged in.
   */
  const isLoggedIn = computed(() => user.value !== null)

  return { user, login, logout, isLoggedIn, updateUser }
})
