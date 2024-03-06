<template>
  <v-autocomplete
    v-model="model"
    :items="itemsWithTaxon"
    :label="label"
    :search-input.sync="search"
    :disabled="disabled"
    clearable
    dense
    hide-details
    outlined
    @click:clear="clearItems"
  >
    <!-- Display when no data present / user is searching -->
    <template v-slot:no-data>
      <v-list-item>
        <v-list-item-title>
          {{ noItemText }}
          <v-progress-circular
            v-show="search && loading"
            class="ml-2"
            color="#5a6855"
            indeterminate
          ></v-progress-circular>
        </v-list-item-title>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    label: {
      type: String,
      default: 'taxon of interest (e.g: p__Proteobacteria)',
    },
    value: {
      type: String,
      default: '',
    },
    release: {
      type: String,
      default: 'current', // supports: 'current', 'all'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    // All items that will be shown in the dropdown menu
    items: [] as string[],

    // The search query being input by the user
    search: '',

    // The API call, null if not running
    searchTimeout: null as ReturnType<typeof setTimeout> | null,
    loading: false,
  }),
  watch: {
    // If the search value is updated, run a search
    search(after: string, before: string) {
      after && after.length > 0 && after !== before && this.model !== after && this.searchForTaxon(after)
    },
  },

  computed: {
    // Listen to / update the bound model
    model: {
      get(): string {
        return this.value;
      },
      set(value: string) {
        this.$emit('input', value);
      },
    },

    // Displayed when no items are present
    noItemText(): string {
      if (this.search) {
        if (this.loading) {
          return 'Searching...'
        } else {
          return 'No results found'
        }
      } else {
        return 'Enter a taxon to search'
      }
    },

    // If there is a selected taxon, ensure it is included in the items list
    itemsWithTaxon(): string[] {
      if (!this.search && this.model && this.model.length > 0 && this.items.indexOf(this.model) < 0) {
        this.items.push(this.model)
      }
      return this.items;
    }
  },
  methods: {
    // Searches for the taxon in the database
    searchForTaxon(val: string) {
      this.loading = true;
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.searchTimeout = setTimeout(() => {

        // Determine which method to use (all releases / current)
        let searchMethod = this.$api.taxon.searchForTaxonByName;
        if (this.release === 'all') {
          searchMethod = this.$api.taxon.searchForTaxonByNameAllReleases;
        }

        // Run the search
        this.items = []
        searchMethod(val)
          .then(resp => {
            // Only set the state data if this request is the most current one
            if (this.search === val) {
              this.items = resp.data.matches
            }
          })
          .catch((err) => {
            this.$accessor.api.defaultCatch(err);
          })
          .finally(() => {
            if (this.search === val) {
              this.loading = false;
            }
          })
      }, 200)
    },

    // When the user requests to clear all items from the search area
    clearItems() {
      this.model = '';
      this.items = []
      this.search = ''
    }
  }
})
</script>
