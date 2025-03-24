import type { User } from '@/models/user'
import { useLocalStorage } from '@vueuse/core'
import { destr } from 'destr'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useFormationsStore } from './formations'
import { useFormationCategoriesStore } from './formations'
import { useFormationStore } from './formations'

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

  if (user.value === null) {
    // Try to fetch the user from the API. Will fail if the user is not logged in,
    // but we don't care, we will just keep the user set to null.
    axios.get(`${import.meta.env.VITE_API_URL}/api/me`).then((response) => {
      user.value = response.data
    })
  }

  /**
   * Login the user.
   * @param email - The email of the user.
   * @param password - The password of the user.
   * @param remember - Whether to remember the user.
   * @returns Whether the login was successful.
   */
  const login = async (email: string, password: string, remember: boolean) => {
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

    useFormationsStore().clear()
    useFormationCategoriesStore().clear()
    useFormationStore().clear()
  }

  const updatePassword = async (input: { password: string; password_confirmation: string }) => {
    await axios.put(`${import.meta.env.VITE_API_URL}/api/me`, input, {
      withCredentials: true,
      withXSRFToken: true,
    })
  }

  return { user, login, logout, updatePassword }
})
