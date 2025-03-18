import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router/index'
import axios from 'axios'
const app = createApp(App)

// By default, axios will not send cookies with cross-site requests.
// To fix this, we need to set the `withCredentials` option to `true`.
axios.defaults.withCredentials = true

// By default, axios will not send the XSRF token with cross-site requests.
// To fix this, we need to set the `withXSRFToken` option to `true`.
axios.defaults.withXSRFToken = true

axios.defaults.baseURL = import.meta.env.VITE_API_URL

axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // If the user is not authenticated and tries to access a protected route, redirect to the login page
    if (error.response.status === 401) {
      router.replace(`/login?redirect=${router.currentRoute.value.path}`)
      return { data: undefined }
    }

    // If the CSRF token is invalid, refresh it
    if (error.response.status === 419) {
      return axios.get('/sanctum/csrf-cookie').then(() => {
        return axios(error.config)
      })
    }

    return Promise.reject(error)
  },
)

app.use(createPinia())
app.use(router)

app.mount('#app')
