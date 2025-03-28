import router from '@/router'
import axios, { AxiosError } from 'axios'

// By default, axios will not send cookies with cross-site requests.
// To fix this, we need to set the `withCredentials` option to `true`.
axios.defaults.withCredentials = true

// By default, axios will not send the XSRF token with cross-site requests.
// To fix this, we need to set the `withXSRFToken` option to `true`.
axios.defaults.withXSRFToken = true

axios.defaults.baseURL = import.meta.env.VITE_API_URL

/**
 * This function is used to refresh the CSRF token if it is invalid.
 *
 * Once the CSRF token is refreshed, the request is retried.
 *
 * @param error - The error to check.
 * @returns The error or the response from the API.
 */
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

/**
 * This function is used to redirect the user to the login page if they are not authenticated and try to access a protected route.
 *
 * @param error - The error to check.
 * @returns The error or the response from the API.
 */
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

/**
 * @var defaultAxios - The default axios instance.
 * This instance has an interceptor that refreshes the CSRF token if it is invalid.
 */
const defaultAxios = axios.create()

/**
 * @var authenticatedAxios - The authenticated axios instance.
 * This instance has an interceptor that refreshes the CSRF token if it is invalid,
 * and another interceptor that redirects the user to the login page if they are not authenticated and try to access a protected route.
 */
const authenticatedAxios = axios.create()

// Add interceptors to the axios instances
defaultAxios.interceptors.response.use(undefined, csrfSafeGuard)
authenticatedAxios.interceptors.response.use(undefined, csrfSafeGuard)
authenticatedAxios.interceptors.response.use(undefined, redirectIfUnauthenticated)

export { defaultAxios, authenticatedAxios }
