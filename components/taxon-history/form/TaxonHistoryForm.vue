<template>
  <div>
    <!-- Form -->
    <div class="d-flex flex-wrap">
      <TaxonHistorySelect
        v-model="rFrom"
        :items="itemsFrom"
        label="From"
      />
      <TaxonHistorySelect
        v-model="rTo"
        :items="itemsTo"
        class="ml-2"
        label="To"
      />
      <TaxonSearchAutocomplete
        v-model="taxon"
        class="ml-2"
        label="taxon of interest (e.g: p__Proteobacteria)"
        release="all"
      />
      <!--      <v-btn-->
      <!--        class="ml-2"-->
      <!--        color="#5a6855"-->
      <!--        depressed-->
      <!--        fab-->
      <!--        small-->
      <!--        @click="submitForm"-->
      <!--      >-->
      <!--        <v-icon color="white">-->
      <!--          {{ mdiMagnifySvg }}-->
      <!--        </v-icon>-->
      <!--      </v-btn>-->
    </div>
  </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import TaxonHistorySelect from "~/components/taxon-history/form/TaxonHistorySelect.vue";
import {mdiMagnify} from "@mdi/js";
import TaxonSearchAutocomplete from "~/components/shared/TaxonSearchAutocomplete.vue";
import {TaxonHistoryRelease, TaxonHistoryReleases, TaxonHistorySearch} from "~/assets/models/taxon-history";

// Helper functions
function orderReleases(a: TaxonHistoryRelease, b: TaxonHistoryRelease): [TaxonHistoryRelease, TaxonHistoryRelease] {
  const i = TaxonHistoryReleases.indexOf(a);
  const j = TaxonHistoryReleases.indexOf(b);
  if (i < j) {
    return [a, b];
  } else {
    return [b, a];
  }
}

export default Vue.extend({
  components: {TaxonSearchAutocomplete, TaxonHistorySelect},
  props: {
    value: {
      type: Object as PropType<TaxonHistorySearch>
    }
  },

  computed: {

    // The "from" release
    rFrom: {
      get(): TaxonHistoryRelease {
        return this.value.from;
      },
      set(val: TaxonHistoryRelease) {
        const model = Object.assign({}, this.value);
        const [rFrom, rTo] = orderReleases(val, model.to);
        model.from = rFrom
        model.to = rTo
        this.$emit('input', model)
      }
    },

    // The "to" release
    rTo: {
      get(): TaxonHistoryRelease {
        return this.value.to;
      },
      set(val: TaxonHistoryRelease) {
        const model = Object.assign({}, this.value);
        const [rFrom, rTo] = orderReleases(model.from, val);
        model.from = rFrom
        model.to = rTo
        this.$emit('input', model)
      }
    },

    // The selected taxon
    taxon: {
      get(): string {
        return this.value.taxon;
      },
      set(val: string) {
        const model = Object.assign({}, this.value);
        model.taxon = val || ''
        this.$emit('input', model)
      }
    },

    // Display all the "from" release options
    itemsFrom(): VSelectItem[] {
      const out = [] as VSelectItem[];
      for (let i = 0; i < TaxonHistoryReleases.length - 1; i++) {
        const release = TaxonHistoryReleases[i];
        out.push({
          text: `Release ${release}`,
          value: release,
        });
      }
      return out;
    },

    // Display all the "to" release options
    itemsTo(): VSelectItem[] {
      const out = [] as VSelectItem[];
      for (let i = 1; i < TaxonHistoryReleases.length; i++) {
        const release = TaxonHistoryReleases[i];
        out.push({
          text: release === TaxonHistoryRelease.NCBI ? release : `Release ${release}`,
          value: release,
        });
      }
      return out;
    },

  },
  data: () => ({
    // Icons
    mdiMagnifySvg: mdiMagnify,
  }),
  methods: {
    // submitForm() {
    //   // Validates the form and returns the parameters
    //   let errors = false;
    //
    //   // Must search something
    //   if (this.rFrom === this.rTo) {
    //     errors = true;
    //     this.$accessor.api.addMessage({
    //       message: 'The "from" and "to" releases must be different.',
    //       status: ApiMessageStatus.WARNING
    //     })
    //   }
    //
    //   if (this.taxon == null || this.taxon.length === 0) {
    //     errors = true;
    //     this.$accessor.api.addMessage({
    //       message: 'You must enter a taxon of interest.',
    //       status: ApiMessageStatus.WARNING
    //     })
    //   }
    //
    //   // Stop if any errors were found
    //   if (errors) {
    //     return;
    //   }
    //
    //   if (this.rTo === TaxonHistoryRelease.NCBI) {
    //     this.$accessor.api.addMessage({
    //       message: 'Note: NCBI taxonomy is at the time of the latest GTDB release.',
    //       status: ApiMessageStatus.INFO
    //     })
    //   }
    //
    //   // Notify the parent that the form is valid
    //   this.$emit('submit', true)
    //
    //   // // No errors, set the parameters
    //   // this.setUrlParameters();
    //   // this.$accessor.taxonhistory.loadSankey();
    // },

    // Updates the query parameters to contain the selected values
    setUrlParameters() {
      const query = Object.assign({}, this.$route.query)
      const rFrom = `R${this.rFrom}`;
      const rTo = this.rTo === TaxonHistoryRelease.NCBI ? 'NCBI' : `R${this.rTo}`;
      if (query.from !== rFrom && query.to !== rTo && query.query !== this.taxon) {
        query.from = rFrom;
        query.to = rTo;
        query.query = this.taxon;
        this.$router.replace({query})
      }
    },

  },
})
</script>

<style scoped>
</style>
