import './assets/styles/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import Tooltip from 'primevue/tooltip'
import focusHover from './directives/focusHover'

const app = createApp(App)
app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: Aura,
  },
})
app.directive('tooltip', Tooltip)
app.directive('focusHover', focusHover)
app.mount('#app')
