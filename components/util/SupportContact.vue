<template>
  <div class="flex">
    <!-- Click-to-reveal gate -->
    <v-btn
      v-if="!revealed"
      class="pl-0"
      small
      text
      @click="reveal"
    >
      <v-icon left small>mdi-email-outline</v-icon>
      Show contact email
    </v-btn>

    <!-- Only rendered into the DOM after user interaction -->
    <div v-else>
      <a :href="mailtoLink">{{ emailDisplay }}</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SupportContact',

  data() {
    return {
      revealed: false,
      // Base64-encoded to avoid the raw address sitting in bundled JS/HTML source.
      encodedEmail: 'c3VwcG9ydEBndGRiLmVjb2dlbm9taWMub3Jn'
    };
  },

  computed: {
    // Decoded only when needed, and only ever placed in the DOM after `revealed` is true.
    emailDisplay() {
      let buffer = Buffer.from(this.encodedEmail, 'base64');
      return buffer.toString('utf-8');
    },
    mailtoLink() {
      return `mailto:${this.emailDisplay}`;
    }
  },

  methods: {
    reveal() {
      this.revealed = true;
    }
  }
};
</script>
