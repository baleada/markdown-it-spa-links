import NuxtLink from 'nuxt/lib/app/components/nuxt-link'

export default function install (Vue) {
  Vue.component('NuxtLink', (resolve, reject) => resolve(NuxtLink))
}
