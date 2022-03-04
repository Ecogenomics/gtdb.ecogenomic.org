<template>
  <v-row class="d-inline-flex">
    <v-col class="d-flex px-0 flex-grow-0">
      <v-select
        v-model="selectItem"
        :items="items"
        :style="selectStyle"
        background-color="#5a6855"
        class="rounded-r-0 gtdb-select"
        dense
        flat
        hide-details
        solo
      ></v-select>
    </v-col>
    <v-col class="d-flex px-0 flex-grow-1">
      <v-text-field
        v-model="search"
        class="gtdb-text-field rounded-0"
        clearable
        dense
        flat
        hide-details
        label="NCBI ID, organism name"
        light
        solo
        v-on:keyup.enter="doSearch"
      ></v-text-field>
    </v-col>
    <v-col class="d-flex px-0 flex-grow-0">
      <v-btn
        :disabled="!isSearchEnabled"
        class="rounded-l-0 px-0"
        color="#5a6855"
        depressed
        height="38px"
        min-width="auto"
        width="40px"
        @click="doSearch"
      >
        <v-icon
          dark
        >
          {{ mdiMagnifySvg }}
        </v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import {mdiMagnify} from "@mdi/js";

export default Vue.extend({
  name: "MenuSearch",
  props: {
    mini: Boolean
  },
  computed: {
    isSearchEnabled() {
      return this.search != null && (this as any).search.length > 0
    },
    selectStyle() {
      let widthStr = "150px";
      for (let i = 0; i < (this as any).items.length; i++) {
        const curItem = (this as any).items[i];
        if (curItem.value === this.selectItem) {
          widthStr = curItem.width;
          break;
        }
      }
      return `width: ${widthStr};`
    },
    items() {
      return [
        {
          text: this.mini ? 'All' : 'All Fields',
          value: 'al',
          width: this.mini ? '52px' : '89px',
        },
        {
          divider: true
        },
        {
          text: this.mini ? 'GTDB Tax' : 'GTDB Taxonomy',
          value: 'gt',
          width: this.mini ? '94px' : '135px',
        },
        {
          text: this.mini ? 'NCBI Tax' : 'NCBI Taxonomy',
          value: 'nt',
          width: this.mini ? '89px' : '130px',
        },
        {
          text: this.mini ? 'NCBI Org' : 'NCBI Organism name',
          value: 'org',
          width: this.mini ? '89px' : '163px',
        },
        {
          text: this.mini ? 'NCBI ID' : 'NCBI Genome ID',
          value: 'id',
          width: this.mini ? '81px' : '134px',
        },
      ]
    }
  },
  methods: {
    doSearch() {
      let parsedQ: string = ''
      if ((this as any).search != null) {
        parsedQ = (this as any).search.trim()
      }

      // Carries logic across from searches post method
      if (parsedQ.startsWith('RS_') || parsedQ.startsWith('GB_')) {
        parsedQ = parsedQ.substr(3)
      }
      this.$router.push({
        path: '/searches',
        query: {
          s: (this as any).selectItem,
          q: parsedQ
        }
      })
    },
  },
  data: () => ({
    search: '',
    selectItem: 'al',
    mdiMagnifySvg: mdiMagnify,
  }),
})
</script>

<style scoped>
/* ----------------------- SEARCH TEXT AREA ----------------------- */

.gtdb-text-field >>> label {
  font-size: 0.875rem !important;
}

.gtdb-text-field >>> input {
  font-size: 0.875rem;
}

.gtdb-text-field >>> .v-input__slot {
  background-color: #efefef !important;
}

/* ----------------------- SELECT MENU ----------------------- */

/* Base size of the dropdown menu button */
.gtdb-select {
  font-size: 0.75rem;
}

/* Dropdown colour */
.v-list {
  background-color: #c3e3c2 !important;
}

/* Dropdown font */
.v-list-item__title {
  color: #333333;
  font-weight: 400 !important;
}

/* Dropdown current selected item */
.v-list-item--link:before {
  background-color: #5a6855;
}

/* Padding on either side of the dropdown button (not opened) */
.v-select >>> .v-input__slot {
  padding-right: 2px !important;
  padding-left: 8px !important;
}

/* Some random textarea next to the dropdown button text */
.v-select__selections input {
  display: none;
}

/* Remove the little bit of padding next to the icon */
.v-select >>> .v-input__append-inner {
  padding-left: 0 !important;
}

/* ----------------------- SEARCH BUTTON ----------------------- */

/* Disabled button background colour */
.theme--dark.v-btn.v-btn--disabled.v-btn--has-bg {
  background-color: #d2d2d2 !important;
}

</style>
