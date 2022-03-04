import {Plugin} from '@nuxt/types'
import {API} from "~/assets/api/api";

const api = new API();

declare module 'vue/types/vue' {
  // this.$api inside Vue components
  interface Vue {
    $api: typeof api
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$api inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $api: typeof api
  }

  // nuxtContext.$api
  interface Context {
    $api: typeof api
  }
}

declare module 'vuex/types/index' {
  // this.$api inside Vuex stores
  interface Store<S> {
    $api: typeof api
  }
}

const myPlugin: Plugin = (context, inject) => {
  inject('api', api)
}

export default myPlugin
