import './assets/global.scss'
import'./assets/font/iconfont.js'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router.js'
import fly from "./lib/flyio.js"
import Storage from "./lib/utils/storage.js"
import { createPinia } from 'pinia'
import {permission} from "@/directives/permission.js";

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

app.config.globalProperties.$fly = fly
app.config.globalProperties.$storage = Storage

app.directive('permission', permission)

app.mount('#app')
