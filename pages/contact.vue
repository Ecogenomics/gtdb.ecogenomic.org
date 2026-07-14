<template>
  <v-container class="gtdb-container">

    <div>

      <v-card class="pa-2" style="min-height: 70vh">

        <v-card-title class="text-h5">
          Contact us
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="text--primary">
          <p>We appreciate all feedback regarding the GTDB. Please choose the option below that best matches your question:</p>




          <div class="mb-3">
            <strong>1. General questions about GTDB</strong>
            <p class="mb-0">
              Ask on the public
              <a href="https://forum.gtdb.ecogenomic.org/" target="_blank">GTDB forum</a>,
              so that it can act as a resource that benefits the entire community.
            </p>
          </div>

          <div class="mb-3">
            <strong>2. Issues or bugs with GTDB-Tk</strong>
            <p class="mb-0">
              Please raise an
              <a href="https://github.com/Ecogenomics/GTDBTk/issues" target="_blank">issue</a>
              on GitHub.
            </p>
          </div>

          <div class="mb-3">
            <strong>3. Anything else</strong>
            <p class="mb-0">
              If your question doesn't fit the above, click the following button to reveal our support address and we will get back to you as soon as possible.
            </p>
            <SupportContact />
          </div>
        </v-card-text>


      </v-card>

    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Recaptcha from "~/components/layout/Recaptcha.vue";
import SupportContact from "~/components/util/SupportContact.vue";

export default Vue.extend({
  head() {
    return {
      title: 'Contact us',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `Contact the GTDB team through the form provided on this page.`
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: `contact us, email, contact, gtdb, staff`
        }
      ]
    }
  },
  components: {
    SupportContact,
    Recaptcha
  },
  computed: {
    enableSendButton() {
      if (!this.captchaClientData || this.captchaClientData.length === 0) {
        return false;
      }
      if (this.messageIsSending) {
        return false;
      }
      if (this.email.length == 0 || this.subject.length == 0 || this.message.length == 0) {
        return false;
      }
      return true;
    }
  },
  data: () => ({
    captchaClientData: '',
    captchaSiteKey: process.env.captchaSiteKey,
    message: '',
    subject: '',
    email: '',
    alertIsVisible: false,
    alertType: '',
    alertMessage: '',
    messageIsSending: false
  }),
  methods: {
    getCaptchaData(response: any) {
      this.captchaClientData = response
    },
    showErrorAlert(message: string) {
      this.alertIsVisible = true;
      this.alertMessage = message;
      this.alertType = 'error'
    },
    showSuccessAlert(message: string) {
      this.alertIsVisible = true;
      this.alertMessage = message;
      this.alertType = 'success'
    },
    clearForm() {
      this.email = ''
      this.subject = ''
      this.message = ''
    },
    submitForm() {
      this.messageIsSending = true;
      this.$api.util.sendContactUsEmail({
        fromEmail: this.email,
        subject: this.subject,
        message: this.message,
        clientResponse: this.captchaClientData
      })
        .then((response) => {
          this.showSuccessAlert('Successfully sent message.')
          this.clearForm()
        }, (error) => {
          let errorMessage = error;
          try {
            if (error.response.message) {
              errorMessage = error.response.message;
            }
          } catch {
          }
          this.showErrorAlert(`Error sending message: ${errorMessage}`)
        })
        .catch((err) => {
          this.$accessor.api.defaultCatch(err);
        })
        .finally(() => {
          this.messageIsSending = false;
        });
    },
  },

})
</script>

<style scoped>

</style>
