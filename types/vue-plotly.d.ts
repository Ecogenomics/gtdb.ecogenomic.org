import Vue from 'vue'
import Plotly from 'plotly.js'

declare module 'vue/types/vue' {
  interface Vue {
    $Plotly: typeof Plotly
  }
}
