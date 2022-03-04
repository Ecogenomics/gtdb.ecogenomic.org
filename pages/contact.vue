<template>
  <v-container class="gtdb-container">

    <div>

      <v-card class="pa-2">

        <v-card-title class="text-h5">
          Contact us
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="text--primary">
          <p>
            We appreciate all feedback regarding the GTDB. We encourage questions to be asked on the
            public <a href="https://forum.gtdb.ecogenomic.org/" target="_blank">GTDB forum</a> so that it can act as a
            resource that benefits the entire community.
          </p>
          <p>
            If you have any questions or issues using GTDB-Tk, please raise an
            <a href="https://github.com/Ecogenomics/GTDBTk/issues" target="_blank">issue</a> on GitHub instead.
          </p>

          <v-card class="pa-5" flat
                  outlined
                  style="max-width: 700px;"
          >
            <v-form>

              <v-text-field
                v-model="email"
                label="E-mail"
                placeholder="someone@example.com"
                required
              ></v-text-field>

              <v-text-field
                v-model="subject"
                label="Subject"
                required
              ></v-text-field>

              <v-textarea
                v-model="message"
                label="Message"
                placeholder="Your message..."
              ></v-textarea>

              <Recaptcha @passed="getCaptchaData"/>

              <v-btn
                :disabled="!enableSendButton"
                :loading="messageIsSending"
                class="mt-4"
                @click="submitForm"
              >
                Send message
              </v-btn>

              <v-alert v-if="alertIsVisible && alertType === 'success'" class="mt-10" color="green" dismissible
                       outlined>
                {{ alertMessage }}
              </v-alert>

              <v-alert v-if="alertIsVisible && alertType === 'error'" class="mt-10" color="red" dismissible outlined>
                {{ alertMessage }}
              </v-alert>

            </v-form>
          </v-card>
        </v-card-text>
      </v-card>

    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Recaptcha from "~/components/layout/Recaptcha.vue";

export default Vue.extend({
  head() {
    return {
      title: 'Contact us',
      meta: [
        {
          hid: 'contact',
          name: 'description',
          content: `Contact the GTDB team.`
        }
      ]
    }
  },
  components: {
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
