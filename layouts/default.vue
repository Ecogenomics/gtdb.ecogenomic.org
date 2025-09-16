<template>
  <v-app>
    <v-overlay
      :value="drawer"
      z-index="4"
    >
    </v-overlay>

    <!-- Left hand navigation drawer -->
    <v-navigation-drawer
      v-model="drawer"
      :style="{ top: $vuetify.application.top + 'px', zIndex: 4 }"
      app
      class="pb-16"
      clipped
      disable-resize-watcher
      fixed
      hide-overlay
    >

      <v-list
        dense
      >

        <MenuListGroup :items="browsersItems" text="Browsers"/>
        <MenuListGroup :items="toolsItems" text="Tools"/>

        <v-list-item href="/downloads" nuxt>
          <v-list-item-title>Downloads</v-list-item-title>
        </v-list-item>

        <MenuListGroup :items="navStatistics" text="Statistics"/>

        <v-list-item href="https://forum.gtdb.ecogenomic.org">
          <v-list-item-title>Forum</v-list-item-title>
        </v-list-item>

        <MenuListGroup :items="navHelp" text="Help"/>
      </v-list>


      <v-divider class="py-2"></v-divider>

      <v-list dense>

        <v-list-item dark>
          <MenuSearch mini/>
        </v-list-item>

        <v-list-item nuxt to="/advanced">
          <v-list-item-title>Advanced search</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- The main app bar -->
    <v-app-bar
      app
      class="fix-navbar-width"
      :class="{'fix-navbar-width': true, 'dev-bg': !isProd}"
      clipped-left
      color="black"
      dark
      fixed
    >
      <v-app-bar-nav-icon
        :class="drawer ? '' : 'd-md-none'"
        @click.stop="drawer = !drawer"
      />

      <GtdbLogo class="d-md-none ml-5"/>

      <!-- row of -->
      <v-row class="d-none d-md-flex align-center" no-gutters>

        <!-- Title -->
        <div class="d-flex flex-grow-0 ml-auto pl-0 pr-5">
          <GtdbLogo/>
        </div>

        <!-- Menu options -->
        <v-col class="d-flex flex-grow-0 px-0 px-lg-3" style="min-width: 131px;">
          <MenuDropdown :items="browsersItems" text="Browsers"/>
        </v-col>
        <v-col class="d-flex flex-grow-0 px-0 px-lg-3" style="min-width: 106px;">
          <MenuDropdown :items="toolsItems" text="Tools"/>
        </v-col>
        <v-col class="d-flex flex-grow-0 px-0 px-lg-3">
          <MenuButton href="/downloads" nuxt text="Downloads"/>
        </v-col>
        <v-col class="d-flex flex-grow-0 px-0 px-lg-3" style="min-width: 132px;">
          <MenuDropdown :items="navStatistics" text="Statistics"/>
        </v-col>
        <v-col class="d-flex flex-grow-0 px-0 px-lg-3">
          <MenuButton :icon="mdiOpenInNewSvg" href="https://forum.gtdb.ecogenomic.org" text="Forum"/>
        </v-col>
        <v-col class="d-flex flex-grow-0 px-0 px-lg-3" style="min-width: 102px;">
          <MenuDropdown :items="navHelp" text="Help"/>
        </v-col>


        <!-- Search Bar -->
        <v-col class="d-flex flex-grow-1 pl-lg-10" style="max-width: 310px;">
          <MenuSearch/>
        </v-col>

        <v-col class="d-flex flex-grow-0 px-0 mr-auto px-lg-3">
          <MenuButton href="/advanced" nuxt text="Advanced"/>
        </v-col>


      </v-row>

      <!--      <v-spacer/>-->

      <!--      &lt;!&ndash; Content to the right of the app bar &ndash;&gt;-->
      <!--      <div>im at the right</div>-->
    </v-app-bar>

    <!-- The main content block -->
    <v-main>
      <nuxt/>
<!--      <CookieConsent />-->
      <ApiSnackbar/>
    </v-main>

    <!-- The footer -->
    <!--    <v-footer-->
    <!--      :absolute="!fixed"-->
    <!--      app-->
    <!--    >-->
    <!--      <span>&copy; {{ new Date().getFullYear() }}</span>-->
    <!--    </v-footer>-->
  </v-app>
</template>

<script>
import MenuDropdown from "../components/layout/MenuDropdown";
import MenuButton from "../components/layout/MenuButton";
import GtdbLogo from "../components/layout/GtdbLogo";
import MenuSearch from "../components/layout/MenuSearch";
import MenuListGroup from "../components/layout/MenuListGroup";
import {mdiOpenInNew} from "@mdi/js";
import ApiSnackbar from "../components/layout/ApiSnackbar";
import CookieConsent from "@/components/layout/CookieConsent";

export default {
  components: {ApiSnackbar, MenuListGroup, MenuSearch, GtdbLogo, MenuButton, MenuDropdown},
  // head() {
  //   let productionScripts = []
  //   if (!process.env.DEV) {
  //     productionScripts = [
  //       { hid: 'analytics', src: `https://www.googletagmanager.com/gtag/js?id=${process.env.googleAnalyticsId}`, defer: true },
  //       { hid: 'analytics-script', innerHTML: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${process.env.googleAnalyticsId}');`, type: 'text/javascript' }
  //     ]
  //   }
  //   return {
  //     script: [
  //     ].concat(productionScripts),
  //     // __dangerouslyDisableSanitizers: ['script']
  //     __dangerouslyDisableSanitizersByTagID: {
  //       'analytics-script': ['innerHTML']
  //     }
  //   }
  // },
  head: {
    htmlAttrs: {
      lang: 'en'
    },
  },
  data() {
    return {
      isProd: process.env.envName === 'prod',
      mdiOpenInNewSvg: mdiOpenInNew,
      drawer: false,
      browsersItems: [
        {
          icon: 'mdi-apps',
          title: 'Alphabetical table',
          to: '/browsers',
          nuxt: true,
          external: false,
        },
        {
          icon: 'mdi-apps',
          title: 'Taxonomy tree',
          to: '/tree',
          nuxt: true,
          external: false,
        },
        {
          icon: 'mdi-apps',
          title: 'Taxon history',
          to: '/taxon-history',
          nuxt: true,
          external: false,
        }
      ],
      toolsItems: [
        {
          icon: 'mdi-apps',
          title: 'GTDB-Tk',
          to: 'https://github.com/Ecogenomics/GTDBTk',
          nuxt: false,
          external: true,
        },
        {
          icon: 'mdi-apps',
          title: 'Third party',
          to: '/tools',
          nuxt: true,
          external: false
        },
        {
          icon: 'mdi-apps',
          title: 'ANI calculator',
          to: '/tools/skani',
          nuxt: true,
          external: false
        },
      ],
      navStatistics: [
        {
          icon: 'mdi-apps',
          title: 'Release 226',
          to: '/stats/r226',
          nuxt: true,
          external: false,
        },
        {
          icon: 'mdi-apps',
          title: 'Release 220',
          to: '/stats/r220',
          nuxt: true,
          external: false,
        },
        {
          icon: 'mdi-apps',
          title: 'Release 214',
          to: '/stats/r214',
          nuxt: true,
          external: false,
        },
        {
          icon: 'mdi-apps',
          title: 'Release 207',
          to: '/stats/r207',
          nuxt: true,
          external: false,
        },
        {
          icon: 'mdi-apps',
          title: 'Release 202',
          to: '/stats/r202',
          nuxt: true,
          external: false,
        },
        {
          icon: 'mdi-apps',
          title: 'Release 95',
          to: '/stats/r95',
          nuxt: true,
          external: false,
        },
        {
          icon: 'mdi-apps',
          title: 'Release 89',
          to: '/stats/r89',
          nuxt: true,
          external: false,
        },
      ],
      navHelp: [
        {
          icon: 'mdi-apps',
          title: 'About',
          to: '/about',
          nuxt: true,
          external: false,
        },
        {
          icon: 'mdi-apps',
          title: 'FAQ',
          to: '/faq',
          nuxt: true,
          external: false,
        },
        {
          icon: 'mdi-apps',
          title: 'Methods',
          to: '/methods',
          nuxt: true,
          external: false,
        },
        {
          icon: 'mdi-apps',
          title: 'API',
          to: process.env.apiBase,
          nuxt: false,
          external: true,
        },
        {
          icon: 'mdi-apps',
          title: 'Attributions',
          to: '/attributions',
          nuxt: true,
          external: false,
        },
        {
          icon: 'mdi-apps',
          title: 'Licenses',
          to: '/licenses',
          nuxt: true,
          external: false,
        },
        {
          icon: 'mdi-apps',
          title: 'Status',
          to: 'https://stats.uptimerobot.com/gZZr2fq81O',
          nuxt: false,
          external: true,
        },
        {
          icon: 'mdi-apps',
          title: 'Contact us',
          to: '/contact',
          nuxt: true,
          external: false,
        },
      ],
    }
  }
}
</script>

<style scoped>
/* TODO: Move this to scss */
.v-application {
  background-color: #e6e6e6;
}

.fix-navbar-width >>> .v-toolbar__content {
  width: 100vw;
}

.dev-bg {
  background-image: url('~/assets/images/dev-bg-tile.png') !important;
  background-repeat: repeat !important;
}
</style>
