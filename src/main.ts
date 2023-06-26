import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import router from './router'

import { createPinia } from 'pinia'
import piniaPersist from "pinia-plugin-persist";


import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'


const app = createApp(App)
app
  .use(router)
  .use(ElementPlus)
  
const pinia = createPinia()
pinia.use(piniaPersist)
app.use(pinia)

app.mount('#app')
