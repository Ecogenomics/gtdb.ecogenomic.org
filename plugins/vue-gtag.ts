import Vue from 'vue'
import VueGtag from 'vue-gtag'
import {Plugin} from '@nuxt/types'

/**
 * @type {import('@nuxt/types').Plugin}
 */
// @ts-ignore
const vueGtag = ({app, env}) => {
  Vue.use(VueGtag, {
    pageTrackerUseFullPath: true,
    pageTrackerScreenviewEnabled: true,
    appName: 'GTDB',
    config: {
      id: env.googleAnalyticsId,
      params: {
        send_page_view: true,
      },
    },
  }, app.router)
}

export default vueGtag
