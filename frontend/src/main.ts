import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useCryptoStore } from './stores/cryptoStore'
import { usePortfolioStore } from '@/stores/portfolioStore'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const cryptoStore = useCryptoStore()
cryptoStore.init()

const portfolioStore = usePortfolioStore()
portfolioStore.load()


app.mount('#app')
