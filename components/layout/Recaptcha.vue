<template>
  <div ref="recaptchaContainer"></div>
</template>

<script lang="ts">
import Vue from 'vue'

// https://gist.github.com/aellerton/92f33cef04a1df76636a658571e07724
function loadRecaptcha(callback: () => void) {
  let win = window as any
  if (win && !win.grecaptcha) {
    let recaptchaScript = document.createElement('script')
    document.head.appendChild(recaptchaScript)
    recaptchaScript.onload = () => {
      // At this point the recaptcha script has loaded but the
      // code in it as not completed loading. Fortunately there's
      // a "ready" function in there that can tell us when it's done.
      let win = window as any
      //console.log('NOTE: script loaded: ', win.grecaptcha)
      win.grecaptcha.ready(() => {
        callback()
      })
    }
    recaptchaScript.setAttribute('src', 'https://www.google.com/recaptcha/api.js')
  } else {
    callback()
  }
}

export default Vue.extend({
  data() {
    return {
      sitekey: process.env.captchaSiteKey,
      passed: false,
      widgetId: 0
    }
  },
  mounted() {
    loadRecaptcha(() => {
      const recaptchaApi: any = (window as any).grecaptcha
      let container = this.$refs.recaptchaContainer
      this.widgetId = recaptchaApi.render(container, {
        callback: () => {
          // The unique "result" that can be checked on the server-side, if desired.
          // See https://stackoverflow.com/a/45765020/963195
          const result = recaptchaApi.getResponse(this.widgetId)
          this.passed = true
          this.$emit('change', this.passed)
          this.$emit('passed', result) // if caller wants to test signature server-side
        },
        'expired-callback': () => {
          this.passed = false
          this.$emit('change', this.passed)
          this.$emit('expired')
        },
        sitekey: this.sitekey
      })
    })
  },
})
</script>
