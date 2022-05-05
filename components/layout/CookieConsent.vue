<template>
  <v-snackbar
    v-model="snackbar"
    timeout="-1"
  >
    This website uses Google Analytics to help us understand how you use our website,
    <a href="https://developers.google.com/analytics/devguides/collection/ga4" target="_blank">learn more</a>.

    <template v-slot:action="{ attrs }">
      <v-btn
        color="blue"
        text
        v-bind="attrs"
        @click="acceptCookies"
      >
        Accept
      </v-btn>
      <v-btn
        color="red"
        text
        v-bind="attrs"
        @click="rejectCookies"
      >
        Reject
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import Vue from 'vue';
import {bootstrap} from 'vue-gtag';

export default Vue.extend({
  data: () => ({
    snackbar: true,
    cookieKey: 'do-not-show-analytics-consent',
  }),
  created() {
    if (this.$cookies.get(this.cookieKey)) {
      this.snackbar = false;
    }
  },
  methods: {
    acceptCookies() {
      this.snackbar = false;
      bootstrap().then((gtag) => {
        this.$cookies.set(this.cookieKey, 'true', {
          path: '/',
          maxAge: 2147483647,
          sameSite: true,
        });
      })
    },
    rejectCookies() {
      this.snackbar = false;
      this.$cookies.set(this.cookieKey, 'true', {
        path: '/',
        maxAge: 604800,
        sameSite: true,
      });
    },
  }
})
</script>

<style scoped>

</style>
