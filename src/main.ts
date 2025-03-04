import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router/index'
import axios from 'axios'

const app = createApp(App)

axios.defaults.withCredentials = true
axios.defaults.withXSRFToken = true

app.use(createPinia())
app.use(router)

app.mount('#app')
