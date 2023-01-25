<template>
  <div v-if="isVisible" class="notifyBar d-flex" style="padding-top: 2px; padding-bottom: 2px;">
    <div class="d-flex ml-5" style="min-width: 30px;">
    </div>
    <div class="d-flex mx-auto my-auto body-2">
      <slot></slot>
    </div>
    <div class="d-flex mr-5" style="min-width: 30px;">
      <v-btn
        color="#a0b8a0"
        depressed
        icon
        small
        @click="close"
      >
        <v-icon>
          {{ mdiCloseSvg }}
        </v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import {mdiClose} from '@mdi/js';

export default Vue.extend({
  props: {
    uid: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: false,
      default: 2147483647
    }
  },
  computed: {
    cookieKey(): string {
      return `gtdb-notify-bar-hidden-${this.uid}`;
    }
  },
  data: () => ({
    isVisible: true,
    mdiCloseSvg: mdiClose,
  }),
  methods: {
    close() {
      this.$cookies.set(this.cookieKey, 'true', {
        path: '/',
        maxAge: this.age,
        sameSite: true,
      });
      this.isVisible = false;
    },
  },
  created() {
    if (this.$cookies.get(this.cookieKey)) {
      this.isVisible = false;
    }
  }
})
</script>

<style scoped>
.notifyBar {
  background-color: #2d522d;
  color: #FFFFFF;
  font-weight: 400;
  border-bottom: #4E794E 1px solid
}

.notifyBar:hover {
  background-color: #386438;
  transition: 0.3s;
}

a {
  color: #9adc9a;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
