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

app.use(createPinia())
app.use(router)

app.mount('#app')
