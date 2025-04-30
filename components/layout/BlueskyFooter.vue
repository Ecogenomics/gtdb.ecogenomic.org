<template>
  <div class="bluesky-footer d-flex fill-height justify-center align-center">
    <a href="https://bsky.app/profile/ace-gtdb.bsky.social" target="_blank" class="no-link d-flex align-center">
      <img src="@/assets/images/bluesky.svg" alt="Bluesky Logo" class="bluesky-icon" />
      <span class="ml-1">
        @ace-gtdb.bsky.social
      </span>
    </a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({});
</script>

<style scoped>
.bluesky-footer {
  background-color: #1E1E1E;
  color: #b7b7b7;
}

.no-link {
  color: #b7b7b7;
  text-decoration: none;
}

.bluesky-icon {
  width: 24px;
  height: 24px;
  fill: #0285FF;
}
</style>
