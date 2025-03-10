import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<{
    message: string
    type: 'success' | 'error'
    id: string
  }[]>([])

  const addNotification = (message: string, type: 'success' | 'error') => {
    let id: string;

    do {
      id = Math.random().toString(36).substring(2, 15)
    } while (notifications.value.some(notification => notification.id === id))

    notifications.value.push({ message, type, id })

    setTimeout(() => {
      notifications.value = notifications.value.filter(notification => notification.id !== id)
    }, 3000)
  }

  const removeNotification = (id: string) => {
    notifications.value = notifications.value.filter(notification => notification.id !== id)
  }

  return { notifications, addNotification, removeNotification }
})
