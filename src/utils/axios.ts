import router from '@/router'
import axios, { AxiosError } from 'axios'

// By default, axios will not send cookies with cross-site requests.
// To fix this, we need to set the `withCredentials` option to `true`.
axios.defaults.withCredentials = true

// By default, axios will not send the XSRF token with cross-site requests.
// To fix this, we need to set the `withXSRFToken` option to `true`.
axios.defaults.withXSRFToken = true

axios.defaults.baseURL = import.meta.env.VITE_API_URL

const csrfSafeGuard = async (error: unknown) => {
  if (error instanceof AxiosError && error.response) {
    // If the CSRF token is invalid, refresh it
    if (error.response.status === 419) {
      await axios.get('/sanctum/csrf-cookie')
      if (error.config) {
        return axios(error.config)
      }
    }
  }

  return Promise.reject(error)
}

const redirectIfUnauthenticated = async (error: unknown) => {
  if (error instanceof AxiosError && error.response) {
    // If the user is not authenticated and tries to access a protected route, redirect to the login page
    if (
      error.response.status === 401 &&
      error.config?.url !== '/api/me' &&
      error.config?.url !== '/api/login'
    ) {
      await router.replace(`/login?redirect=${router.currentRoute.value.path}`)
      return { data: undefined }
    }
  }

  return Promise.reject(error)
}

const defaultAxios = axios.create()
const authenticatedAxios = axios.create()

defaultAxios.interceptors.response.use(undefined, csrfSafeGuard)
authenticatedAxios.interceptors.response.use(undefined, csrfSafeGuard)
authenticatedAxios.interceptors.response.use(undefined, redirectIfUnauthenticated)

export { defaultAxios, authenticatedAxios }
