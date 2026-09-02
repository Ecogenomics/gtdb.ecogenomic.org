<template>
  <div v-if="isVisible" class="notifyBar d-flex" style="padding-top: 2px; padding-bottom: 2px;">
    <div class="d-flex ml-5" style="min-width: 30px;">
    </div>
    <div class="d-flex mx-auto my-auto body-2">
      Database connection failure, un-cached content will not be available.
      We have been notified and are working to resolve the issue.
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import NotifyBar from "~/components/index/NotifyBar.vue";

export default Vue.extend({
  components: {NotifyBar},
  data: () => ({
    isVisible: false,
  }),
  mounted() {
    this.$api.status.db().then(res => {
      this.isVisible = !res.data.online || res.status >= 300;
      console.log(`DB status: ${this.isVisible ? "offline" : "online"}`)
    }).catch(err => {
      console.log(`DB status error: ${err}`);
      this.isVisible = true;
    });
  }
})
</script>

<style scoped>
.notifyBar {
  background-color: oklch(55.5% 0.163 48.998);
  color: #FFFFFF;
  font-weight: 400;
  border-bottom: oklch(47.3% 0.137 46.201) 1px solid;
  min-height: 33px;
}

.notifyBar:hover {
  background-color: oklch(47.3% 0.137 46.201);
  transition: 0.3s;
}
</style>

