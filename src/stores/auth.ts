import type { User } from '@/models/user'
import { useLocalStorage } from '@vueuse/core'
import { destr } from 'destr'
import { defineStore } from 'pinia'
import { defaultAxios } from '@/utils/axios'
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
    defaultAxios
      .get(`/api/me`)
      .then((response) => {
        user.value = response.data
      })
      .catch(() => null)
  }

  /**
   * Login the user.
   * @param email - The email of the user.
   * @param password - The password of the user.
   * @param remember - Whether to remember the user.
   */
  const login = async (email: string, password: string, remember: boolean) => {
    const response = await defaultAxios.post<{ user: User }>(`/api/login`, {
      email,
      password,
      remember,
    })

    user.value = response.data.user
  }

  /**
   * Logout the user.
   */
  const logout = () => {
    user.value = null
    defaultAxios.post(
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
    await defaultAxios.put(`${import.meta.env.VITE_API_URL}/api/me`, input, {
      withCredentials: true,
      withXSRFToken: true,
    })
  }

  return { user, login, logout, updatePassword }
})
