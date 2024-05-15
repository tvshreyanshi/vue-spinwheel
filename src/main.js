import { createApp } from 'vue'
import App from './App.vue'
import store from '../src/store/store'
import './assets/scss/style.scss'

createApp(App).use(store).mount('#app')
