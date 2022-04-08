// Load the version
const fs = require('fs')
const packageJson = fs.readFileSync('./package.json')
const version = JSON.parse(packageJson).version || ''


export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: 'GTDB - %s',
    title: 'gtdb.ecogenomic.org',
    meta: [{charset: 'utf-8'}, {name: 'viewport', content: 'width=device-width, initial-scale=1'}, {
      hid: 'description',
      name: 'description',
      content: ''
    }, {name: 'format-detection', content: 'telephone=no'}],
    link: [{rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/css/fonts.css', '~/assets/css/global.css',
    '~/assets/css/width.css', '~/assets/css/overflow.css', '~/assets/css/position.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/api.ts',
    '~/plugins/vue-gtag' // https://github.com/MatteoGabriele/vue-gtag/tree/1.0
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [// https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build', // https://go.nuxtjs.dev/vuetify
    ['@nuxtjs/vuetify', {
      defaultAssets: false, icons: {
        iconfont: 'mdiSvg'
      }
    }], // https://typed-vuex.roe.dev
    'nuxt-typed-vuex'],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [// https://go.nuxtjs.dev/axios
    '@nuxtjs/axios', // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa', // https://pwa.nuxtjs.org/
    'cookie-universal-nuxt' // https://www.npmjs.com/package/cookie-universal-nuxt
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseUrl: '/'
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    // icon: {
    //   source: '~/assets/images/gtdb-logo/gtdb-icon.svg'
    // },
    icon: false,
    meta: false,
    manifest: false,
    workbox: {},
    onesignal: false
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    theme: {
      disable: true
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build

  build: {
    extractCSS: {
      ignoreOrder: true
    },

    html: {
      minify: {
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: true,
        minifyJS: true,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true,
        preserveLineBreaks: false,
        collapseWhitespace: true,
        removeComments: true
      }
    },

    // Make the filenames more verbose for bundles to reduce likelihood of hashing collisions
    filenames: {
      app: ({ isDev, isModern }) => isDev ? `[name]${isModern ? '.modern' : ''}.js` : `app/[contenthash]${isModern ? '.modern' : ''}.js`,
      chunk: ({ isDev, isModern }) => isDev ? `[name]${isModern ? '.modern' : ''}.js` : `chunk/[contenthash]${isModern ? '.modern' : ''}.js`,
      css: ({ isDev }) => isDev ? '[name].css' : `css/[contenthash].css`,
      img: ({ isDev }) => isDev ? '[path][name].[ext]' : `img/[contenthash].[ext]`,
      font: ({ isDev }) => isDev ? '[path][name].[ext]' : `fonts/[contenthash].[ext]`,
      video: ({ isDev }) => isDev ? '[path][name].[ext]' : `videos/[contenthash].[ext]`
    }
  },

  // Environment variables
  env: {
    apiMessageTimeout: 10000,
    apiTimeout: 30000,  // number of ms to wait until api call fails
    apiBase: process.env.API_BASE,
    advancedMaxHistory: 50,  // Maximum number of history states to retain in advanced search
    captchaSiteKey: process.env.CAPTCHA_KEY,
    googleAnalyticsId: process.env.GA_TRACKING_ID,
    latestStatsPageUrl: '/stats/r207',  // this is used to point to the latest stats page,
    nuxtVersion: version
  },

  // https://github.com/nuxt/telemetry
  telemetry: false,

  // TODO: TEST THIS OUT https://github.com/nuxt/nuxt.js/issues/1508
  // preload fonts
  // https://github.com/nuxt/nuxt.js/issues/1838
  render: {
    bundleRenderer: {
      shouldPrefetch: (file, type) => ['script', 'style', 'font'].includes(type) && !file.includes('admin')
    }
  },

  // If a response >=400 is returned then this page will be displayed
  generate: {
    fallback: 'error.html',
    subFolders: false
  }

}
