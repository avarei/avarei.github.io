import { registerSW } from 'virtual:pwa-register'

export function setupServiceWorker() {
  registerSW({ immediate: true })
}
