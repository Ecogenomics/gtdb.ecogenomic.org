<template>
  <v-snackbar
    v-if="currentMessage"
    v-model="showApiSnackbar"
    :timeout="apiTimeout"
    color="#3e3e3e"
    elevation="1"
  >
    <div class="d-flex flex-row rounded pa-2" :style="{'min-width': '200px;', 'background-color': currentMessageColour}">

      <!-- Icon -->
      <div class="d-flex my-auto flex-column mr-2" v-if="currentIconSvg">
        <v-icon>
          {{ currentIconSvg }}
        </v-icon>
      </div>

      <!-- Main content -->
      <div class="d-flex flex-row flex-column">

        <!-- First row - time -->
        <div class="d-flex flex-row " style="font-size: 10px;">
          {{ currentMessage.timestamp.toLocaleTimeString() }}
        </div>

        <!-- Second row - message -->
        <div class="d-flex flex-row">
          {{ currentMessage.message }}
        </div>


      </div>

    </div>

<!--    <v-alert-->
<!--      :color="currentMessageColour"-->
<!--      :type="currentMessage.status"-->
<!--      class="mb-0"-->
<!--      dense-->
<!--      elevation="0"-->
<!--    >-->
<!--      <div class="d-flex" style="font-size: 12px;">-->
<!--        {{ currentMessage.timestamp.toLocaleTimeString() }}-->
<!--      </div>-->
<!--      <div class="d-flex">-->
<!--        {{ currentMessage.message }}-->

<!--      </div>-->
<!--    </v-alert>-->
    <template v-slot:action="{ attrs }">
      <v-btn
        color="white"
        icon
        v-bind="attrs"
        @click="showApiSnackbar = false"
      >
        <v-icon>
          {{ mdiCloseSvg }}
        </v-icon>
      </v-btn>
    </template>
    <div
      v-if="messages.length > 1"
      class="d-flex w-100"
    >
      <div class="d-flex mx-auto mt-2" style="color: #638d61;">
        <v-btn
          :disabled="messageNumber === 0"
          color="white"
          depressed
          icon
          x-small
          @click="firstMessage"
        >
          <v-icon>
            {{ mdiPageFirstSvg }}
          </v-icon>
        </v-btn>
        <v-btn
          :disabled="messageNumber === 0"
          color="white"
          depressed
          icon
          x-small
          @click="prevMessage"
        >
          <v-icon>
            {{ chevronLeftSvg }}
          </v-icon>
        </v-btn>
        <b>{{
            messageNumber === -1 ? messages.length.toLocaleString() : (messageNumber + 1).toLocaleString()
          }}</b>/<b>{{ messages.length.toLocaleString() }}</b>
        <v-btn
          :disabled="messageNumber === -1"
          color="white"
          depressed
          icon
          x-small
          @click="nextMessage"
        >
          <v-icon>
            {{ chevronRightSvg }}
          </v-icon>
        </v-btn>
        <v-btn
          :disabled="messageNumber === -1"
          color="white"
          depressed
          icon
          x-small
          @click="lastMessage"
        >
          <v-icon>
            {{ mdiPageLastSvg }}
          </v-icon>
        </v-btn>
      </div>
    </div>
  </v-snackbar>
</template>

<script lang="ts">
import Vue from 'vue';
import {ApiMessage, ApiMessageStatus} from "~/store/api";
import {
  mdiAlert,
  mdiAlertCircle, mdiAlertOctagon, mdiCheckCircle,
  mdiChevronLeft,
  mdiChevronRight,
  mdiClose,
  mdiInformation,
  mdiPageFirst,
  mdiPageLast
} from "@mdi/js";

export default Vue.extend({
  computed: {
    currentMessage(): ApiMessage | null {
      if (this.messages.length === 0) {
        return null;
      }
      // Just show the latest
      if (this.messageNumber === -1) {
        return this.messages[this.messages.length - 1];
      } else {
        return this.messages[this.messageNumber];
      }
    },
    showApiSnackbar: {
      get: function () {
        return this.$accessor.api.showApiSnackbar;
      },
      set: function (value) {
        this.$accessor.api.setShowApiSnackbar(value === true);
      }
    },
    messages(): ApiMessage[] {
      return this.$accessor.api.getMessages;
    },
    currentMessageColour(): string {
      if (!this.currentMessage) {
        return '#ffffff';
      }
      if (this.currentMessage?.status === ApiMessageStatus.ERROR) {
        return '#ff5252'
      } else if (this.currentMessage?.status === ApiMessageStatus.WARNING) {
        return '#fb8c00'
      } else if (this.currentMessage.status === ApiMessageStatus.INFO) {
        return '#2196f3'
      } else if (this.currentMessage.status === ApiMessageStatus.SUCCESS) {
        return '#4caf50'
      } else {
      }
      return '#ffffff'
    },
    currentIconSvg(): string | null{
      if (!this.currentMessage) {
        return null;
      }
      if (this.currentMessage.status === ApiMessageStatus.INFO) {
        return mdiInformation;
      } else if (this.currentMessage.status === ApiMessageStatus.SUCCESS) {
        return mdiCheckCircle;
      } else if (this.currentMessage.status === ApiMessageStatus.WARNING) {
        return this.mdiAlertSvg;
      } else if (this.currentMessage.status === ApiMessageStatus.ERROR) {
        return this.mdiAlertOctagonSvg;
      } else {
        return null;
      }
    }
  },
  data: function () {
    return {
      apiTimeout: process.env.apiMessageTimeout,
      mdiPageLastSvg: mdiPageLast,
      mdiPageFirstSvg: mdiPageFirst,
      chevronLeftSvg: mdiChevronLeft,
      chevronRightSvg: mdiChevronRight,
      mdiCloseSvg: mdiClose,
      mdiAlertCircleSvg: mdiAlertCircle,
      mdiInformationSvg: mdiInformation,
      mdiCheckCircleSvg: mdiCheckCircle,
      mdiAlertOctagonSvg: mdiAlertOctagon,
      mdiAlertSvg: mdiAlert,
      messageNumber: -1,
    };
  },
  methods: {
    nextMessage() {
      if (this.messageNumber === -1) {
        this.messageNumber = this.messages.length - 1;
      } else {
        this.messageNumber++;
      }
      if (this.messageNumber === this.messages.length - 1) {
        this.messageNumber = -1;
      }
    },
    lastMessage() {
      this.messageNumber = -1;
    },
    prevMessage() {
      if (this.messageNumber === -1) {
        this.messageNumber = this.messages.length - 2;
      } else {
        this.messageNumber--;
      }
    },
    firstMessage() {
      this.messageNumber = 0;
    }
  }
})
</script>
