<template>
  <v-container fluid>
    <v-row class="pa-5 flex-wrap" no-gutters>
      <v-col
        class="mx-auto mb-3"
        style="max-width: 400px;"
      >
        <v-card class="pos-fixed-md" style="width: 400px;">
          <v-card-title class="d-flex">
            <div class="d-flex mx-auto text-h5">
              {{ gid }}
            </div>
          </v-card-title>
          <v-card-subtitle class="d-flex">
            <div class="d-flex mx-auto text-h6">
              <template v-if="genomeCard.metadataTaxonomy">
                <template
                  v-if="genomeCard.metadataTaxonomy.gtdbPhylum && genomeCard.metadataTaxonomy.gtdbPhylum !== 'p__'">
                  <template v-if="genomeCard.metadataTaxonomy.gtdbSpecies !== 's__'">
                    <i>{{ genomeCard.metadataTaxonomy.gtdbSpecies.substring(3) }}</i>
                  </template>
                  <template v-else>
                    <i>{{ genomeCard.metadataTaxonomy.gtdbGenus.substring(3) }} sp.</i>
                  </template>
                </template>
                <template v-else>
                  <i>Undefined name (Failed Quality Check)</i>
                </template>
              </template>
              <template v-else>
                <v-skeleton-loader
                  class="mt-2"
                  min-width="200px"
                  type="text"
                ></v-skeleton-loader>
              </template>
            </div>
          </v-card-subtitle>

          <v-divider></v-divider>

          <v-card-text>

            <!-- Badges -->
            <div class="d-flex mt-3">
              <div class="d-flex mx-auto flex-wrap">

                <!-- Name -->
                <template v-if="genomeCard.metadataTaxonomy">

                  <!-- Source badge -->
                  <BadgeWithTooltip
                    :text="sourceBadgeText"
                    colour="#1f78b4"
                    tooltip="Indicates if genome is an isolate, MAG, or SAG"
                  />

                  <!-- Quality badge -->
                  <BadgeWithTooltip
                    v-if="genomeCard.metadata_gene.checkm_completeness > 90 && genomeCard.metadata_gene.checkm_contamination < 5"
                    colour="#33a02c"
                    text="HQ"
                    tooltip="High Quality: Completeness>90%, Contamination<5%"
                  />

                  <BadgeWithTooltip
                    v-else-if="genomeCard.metadata_gene.checkm_completeness >= 50 && genomeCard.metadata_gene.checkm_contamination < 10"
                    colour="#ff7f00"
                    text="MQ"
                    tooltip="Medium Quality: Completeness>=50%, Contamination<10%"
                  />
                  <BadgeWithTooltip
                    v-else
                    colour="#b2383a"
                    text="LQ"
                    tooltip="High Quality: Completeness>90%, Contamination<5%"
                  />

                  <!-- Subunits badge -->
                  <BadgeWithTooltip
                    v-if="genomeCard.subunit_summary"
                    :text="genomeCard.subunit_summary"
                    colour="#676469"
                    tooltip="Identification of 5S/16S/23S rRNA genes"
                  />

                  <!-- tRNA badge -->
                  <BadgeWithTooltip
                    :text="`${genomeCard.metadata_nucleotide.trna_aa_count.toLocaleString()} tRNAs`"
                    colour="#f781bf"
                    tooltip="Number of standard amino acids with an identified tRNA"
                  />
                </template>

                <!-- Chips are still loading -->
                <template v-else>
                  <v-skeleton-loader
                    class="mx-1"
                    type="chip"
                  ></v-skeleton-loader>
                  <v-skeleton-loader
                    class="mx-1"
                    type="chip"
                  ></v-skeleton-loader>
                </template>
              </div>
            </div>
            <!-- End badges -->

            <!-- Navigation -->
            <v-list class="mt-3" dense nav>
              <v-list-item-group
                v-model="selectedIndex"
                color="#5A6855"
              >
                <v-list-item
                  v-for="(item, i) in items"
                  :key="i"
                  :href="`#${item.ref}`"
                  @click="selectItem(i)"
                >
                  <v-list-item-content>
                    <v-list-item-title v-text="item.text"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <!-- End navigation -->

            <GenomeExternalLinks
              :genome-card="genomeCard"
              class="mt-2"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Right column -->
      <v-col class="ml-5 mr-auto overflow-x-scroll-md" style="max-width: 1700px">
        <v-card>
          <v-card-text class="text--primary">
            <GenomeTaxonomicInformation
              ref="taxonomic-information"
              :genome-card="genomeCard"
            />
            <GenomeCharacteristics
              ref="genome-characteristics"
              :genome-card="genomeCard"
              class="mt-5"
            />
            <GenomeNcbiMetadata
              ref="ncbi-metadata"
              :genome-card="genomeCard"
              class="mt-5"
            />
            <GenomeTaxonHistory
              ref="taxon-history"
              :accession="gid"
              class="mt-5"
            />
          </v-card-text>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import GenomeTaxonHistory from "~/components/genome/GenomeTaxonHistory.vue";
import {GenomeCard} from "~/assets/api/genome";
import GenomeTaxonomicInformation from "~/components/genome/GenomeTaxonomicInformation.vue";
import GenomeCharacteristics from "~/components/genome/GenomeCharacteristics.vue";
import GenomeNcbiMetadata from "~/components/genome/GenomeNcbiMetadata.vue";
import GenomeExternalLinks from "~/components/genome/GenomeExternalLinks.vue";
import BadgeWithTooltip from "~/components/util/BadgeWithTooltip.vue";
import {mdiArrowCollapseRight} from "@mdi/js";

const SCROLL_OFFSET = -30;


export default Vue.extend({
  components: {
    BadgeWithTooltip,
    GenomeExternalLinks,
    GenomeNcbiMetadata, GenomeCharacteristics, GenomeTaxonomicInformation, GenomeTaxonHistory
  },
  head() {
    return {
      title: `${this.$route.query.gid || 'Genome'}`,
      meta: [
        {
          hid: 'genomes',
          name: 'description',
          content: `GTDB and NCBI metadata about this genome.`
        }
      ]
    }
  },
  computed: {
    gid(): string {
      const gid = this.$route.query.gid;
      if (gid) {
        return gid as string;
      } else {
        return 'N/A'
      }
    },
    sourceBadgeText(): string {
      if (this.genomeCard.metadata_ncbi) {
        if (this.genomeCard.metadata_ncbi.ncbi_genome_category === 'derived from metagenome') {
          return 'MAG'
        } else if (this.genomeCard.metadata_ncbi.ncbi_genome_category === 'derived from single cell') {
          return 'SAG'
        } else if (this.genomeCard.metadata_ncbi.ncbi_genome_category === 'derived from environmental sample' || this.genomeCard.metadata_ncbi.ncbi_genome_category === 'derived from environmental_sample') {
          return 'MAG'
        } else {
          return 'Isolate'
        }
      }
      return ''
    },
  },

  methods: {
    // Retrieve the genome card from the API
    getGenomeCard() {
      this.genomeCard = {} as GenomeCard;
      this.$api.genome.getCard(this.gid).then(response => {
        this.genomeCard = response.data;
      }).catch((err) => {
        this.$accessor.api.defaultCatch(err);
      })
    },

    // When an item is selected
    selectItem(index: number) {
      this.selectedIndex = index;
      this.scrollToSelected();
    },

    // Scroll to a specific anchor point
    scrollToSelected() {
      const curEle = (this.$refs[this.items[this.selectedIndex].ref] as Vue);
      this.$vuetify.goTo(curEle, {offset: 10})
    },

    // Whenever a scroll is triggered check if we need to update the anchor point
    onScroll() {
      for (let i = 0; i < this.items.length; i++) {
        const curEle = (this.$refs[this.items[i].ref] as Vue);
        if (curEle) {
          const curRect = (curEle.$el as Element).getBoundingClientRect();
          const topX = curRect.top + SCROLL_OFFSET;
          const botX = topX + curRect.height + SCROLL_OFFSET;
          if (topX > 0 || botX > 0) {
            if (this.selectedIndex !== i) {
              this.selectedIndex = i;
              // window.location.hash = `#${this.items[i].ref}`
            }
            break;
          }
        }
      }
    },

  },

  watch: {
    // Watch for any changes to the query parameters
    '$route.query': {
      handler(after, before) {
        if (before == null || (after && after.gid !== before.gid)) {
          this.getGenomeCard();
        }
      },
      deep: true
    },
  },

  data: () => ({
    // Icons
    mdiArrowCollapseRightSvg: mdiArrowCollapseRight,

    // The base model
    genomeCard: {} as GenomeCard,

    // All anchor points within the document
    selectedIndex: 0,
    items: [
      {text: 'Taxonomic Information', ref: 'taxonomic-information'},
      {text: 'Genome Characteristics', ref: 'genome-characteristics'},
      {text: 'NCBI Metadata', ref: 'ncbi-metadata'},
      {text: 'Taxon History', ref: 'taxon-history'}
    ],

    // If the genome summary left column should be fixed
    isFixed: false,
  }),

  destroyed() {
    // Remove the event listeners added for this page
    window.removeEventListener('scroll', this.onScroll);
  },

  mounted() {
    // Load the genome card information
    this.getGenomeCard();

    // Scroll to the ref if present in the URL
    const hash = this.$route.hash;
    if (hash) {
      for (let i = 0; i < this.items.length; i++) {
        if (`#${this.items[i].ref}` === hash) {
          this.selectedIndex = i;
          this.scrollToSelected();
          break;
        }
      }
    }

    // Track where the user is on the page
    window.addEventListener('scroll', this.onScroll);
  },
})
</script>

<style scoped>

</style>
