<template>
  <div class="fill-height" style="background-color: rgb(131, 185, 130);">
    <article class="pa-10">
      <h1>{{ errorText }}</h1>
      <template v-if="error.message">
        {{ error.message }}
      </template>
      <template v-else>
        <p>Please
          <nuxt-link to="/contact">let us know.</nuxt-link>
          of this error so we can fix it.
        </p>
        <p>
          <nuxt-link to="/index">Click here to return to the main page.</nuxt-link>
        </p>
      </template>
    </article>
  </div>
</template>

<script>

const HTTP_STATUS_CODES = {
  '200': 'OK',
  '201': 'Created',
  '202': 'Accepted',
  '203': 'Non-Authoritative Information',
  '204': 'No Content',
  '205': 'Reset Content',
  '206': 'Partial Content',
  '300': 'Multiple Choices',
  '301': 'Moved Permanently',
  '302': 'Found',
  '303': 'See Other',
  '304': 'Not Modified',
  '305': 'Use Proxy',
  '307': 'Temporary Redirect',
  '400': 'Bad Request',
  '401': 'Unauthorized',
  '402': 'Payment Required',
  '403': 'Forbidden',
  '404': 'Not Found',
  '405': 'Method Not Allowed',
  '406': 'Not Acceptable',
  '407': 'Proxy Authentication Required',
  '408': 'Request Timeout',
  '409': 'Conflict',
  '410': 'Gone',
  '411': 'Length Required',
  '412': 'Precondition Failed',
  '413': 'Request Entity Too Large',
  '414': 'Request-URI Too Long',
  '415': 'Unsupported Media Type',
  '416': 'Requested Range Not Satisfiable',
  '417': 'Expectation Failed',
  '500': 'Internal Server Error',
  '501': 'Not Implemented',
  '502': 'Bad Gateway',
  '503': 'Service Unavailable',
  '504': 'Gateway Timeout',
  '505': 'HTTP Version Not Supported'
};


export default {
  layout: 'error',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  computed: {
    errorText() {
      if (this.error.statusCode && HTTP_STATUS_CODES[this.error.statusCode.toString()]) {
        return `${this.error.statusCode} - ${HTTP_STATUS_CODES[this.error.statusCode.toString()]}`
      }
      return `${this.error.statusCode} - Unknown error`
    }
  },
  head() {
    return {
      title: 'Error'
    }
  },
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}

body {
  text-align: center;
  padding: 10%;
  font: 20px Helvetica, sans-serif;
  color: #333;
}

h1 {
  font-size: 50px;
  margin: 0;
}

article {
  display: block;
  text-align: left;
  max-width: 800px;
  margin: 0 auto;
}

a {
  color: #FFFFFF;
  text-decoration: none;
}

a:hover {
  color: #333;
  text-decoration: none;
}

@media only screen and (max-width: 480px) {
  h1 {
    font-size: 40px;
  }
}
</style>
