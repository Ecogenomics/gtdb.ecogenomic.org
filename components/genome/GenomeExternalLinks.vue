<template>
  <div class="d-flex">

    <fieldset class="d-flex fieldset-border w-100 pa-2">
      <legend
        class="ml-5 w-auto px-2"
        style="background-color: #7e8f7c; color: white;"
      >
        External links
      </legend>
      <div class="d-flex w-100">


        <template
          v-if="genomeCard.metadataTaxonomy"
        >
          <div
            class="d-flex mx-auto my-auto"
          >
            <a
              :href="`https://www.ncbi.nlm.nih.gov/data-hub/genome/${genomeCard.metadata_ncbi.ncbi_genbank_assembly_accession}`"
              target="_blank"
            >
              <img
                alt="NCBI logo"
                height="80"
                width="100"
                src="~/assets/images/logos/ncbi.svg"
              />
            </a>
          </div>

          <div
            v-if="genomeCard.lpsnUrl"
            class="d-flex mx-auto my-auto"
          >
            <a
              :href="genomeCard.lpsnUrl"
              target="_blank"
            >
              <img
                alt="LPSN logo"
                height="60"
                src="~/assets/images/logos/lpsn.svg"
              />
            </a>
          </div>

          <div
            class="d-flex mx-auto my-auto"
          >
            <a
              :href="`https://www.ebi.ac.uk/ena/browser/view/${genomeCard.metadata_ncbi.ncbi_genbank_assembly_accession}`"
              target="_blank"
            >
              <img
                alt="ENA logo"
                height="80"
                width="100"
                src="~/assets/images/logos/ena.svg"
              />
            </a>
          </div>

        </template>
        <template v-else>
          <v-skeleton-loader
            type="avatar"
            class="mx-auto"
          ></v-skeleton-loader>
        </template>

      </div>
    </fieldset>

  </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {GenomeCard} from "~/assets/api/genome";

export default Vue.extend({
  props: {
    genomeCard: {
      type: Object as PropType<GenomeCard>,
      required: true
    }
  },
  computed: {},
  data: () => ({}),
  methods: {}
})
</script>

<style scoped>
.fieldset-border {
  border: 1px groove #ddd !important;
}


</style>
