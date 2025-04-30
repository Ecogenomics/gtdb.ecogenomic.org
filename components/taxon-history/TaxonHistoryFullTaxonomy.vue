<template>
  <div>
    <h4>Taxonomy</h4>
    The table below shows the parent taxa of the selected taxon as they appeared in specific releases.
    <template v-if="loading">
      <v-skeleton-loader
        max-height="224px"
        type="table"
      ></v-skeleton-loader>
    </template>

    <!-- Show the table if the data are loaded -->
    <template v-else>
      <v-simple-table
        class="mt-2"
        dense
      >
        <template v-slot:default>
          <thead>
          <tr>
            <th
              v-for="(item, index) in header"
              :key="index"
              class="text-left"
            >
              {{ item }}
            </th>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="(item, index) in rows"
            :key="index"
          >
            <td :class="{
                'gtdb-green-bg-table': true,
                'rounded-tl': index === 0,
                'rounded-bl': index === rows.length - 1,
              }">{{ item.release }}
            </td>
            <td v-if="currentTaxonIndex >= 0"
            >
              <!-- If this is the current release, link to the tree -->
              <template v-if="item.release === 'R226' && item.taxonomy.d.length > 3">
                <nuxt-link :to="`/tree?r=${item.taxonomy.d}`">
                  {{ item.taxonomy.d }}
                </nuxt-link>
              </template>
              <!-- Not the current release, just show the taxon -->
              <template v-else>
                {{ item.taxonomy.d }}
              </template>
            </td>
            <td v-if="currentTaxonIndex >= 1">
              <!-- If this is the current release, link to the tree -->
              <template v-if="item.release === 'R226' && item.taxonomy.p.length > 3">
                <nuxt-link :to="`/tree?r=${item.taxonomy.p}`">
                  {{ item.taxonomy.p }}
                </nuxt-link>
              </template>
              <!-- Not the current release, just show the taxon -->
              <template v-else>
                {{ item.taxonomy.p }}
              </template>
            </td>
            <td v-if="currentTaxonIndex >= 2">
              <!-- If this is the current release, link to the tree -->
              <template v-if="item.release === 'R226' && item.taxonomy.c.length > 3">
                <nuxt-link :to="`/tree?r=${item.taxonomy.c}`">
                  {{ item.taxonomy.c }}
                </nuxt-link>
              </template>
              <!-- Not the current release, just show the taxon -->
              <template v-else>
                {{ item.taxonomy.c }}
              </template>
            </td>
            <td v-if="currentTaxonIndex >= 3">
              <!-- If this is the current release, link to the tree -->
              <template v-if="item.release === 'R226' && item.taxonomy.o.length > 3">
                <nuxt-link :to="`/tree?r=${item.taxonomy.o}`">
                  {{ item.taxonomy.o }}
                </nuxt-link>
              </template>
              <!-- Not the current release, just show the taxon -->
              <template v-else>
                {{ item.taxonomy.o }}
              </template>
            </td>
            <td v-if="currentTaxonIndex >= 4">
              <!-- If this is the current release, link to the tree -->
              <template v-if="item.release === 'R226' && item.taxonomy.f.length > 3">
                <nuxt-link :to="`/tree?r=${item.taxonomy.f}`">
                  {{ item.taxonomy.f }}
                </nuxt-link>
              </template>
              <!-- Not the current release, just show the taxon -->
              <template v-else>
                {{ item.taxonomy.f }}
              </template>
            </td>
            <td v-if="currentTaxonIndex >= 5">
              <!-- If this is the current release, link to the tree -->
              <template v-if="item.release === 'R226' && item.taxonomy.g.length > 3">
                <nuxt-link :to="`/tree?r=${item.taxonomy.g}`">
                  {{ item.taxonomy.g }}
                </nuxt-link>
              </template>
              <!-- Not the current release, just show the taxon -->
              <template v-else>
                {{ item.taxonomy.g }}
              </template>
            </td>
            <td v-if="currentTaxonIndex >= 6">
              <!-- If this is the current release, link to the tree -->
              <template v-if="item.release === 'R226' && item.taxonomy.s.length > 3">
                <nuxt-link :to="`/tree?r=${item.taxonomy.s}`">
                  {{ item.taxonomy.s }}
                </nuxt-link>
              </template>
              <!-- Not the current release, just show the taxon -->
              <template v-else>
                {{ item.taxonomy.s }}
              </template>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </template>
  </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {TaxonomyOptionalRelease} from "~/assets/api/taxonomy";
import {TaxonHistoryRelease, TaxonHistoryReleases, TaxonHistorySearch} from "~/assets/models/taxon-history";

const TAXON_TO_INDEX = new Map<string, number>();
TAXON_TO_INDEX.set('d__', 0)
TAXON_TO_INDEX.set('p__', 1)
TAXON_TO_INDEX.set('c__', 2)
TAXON_TO_INDEX.set('o__', 3)
TAXON_TO_INDEX.set('f__', 4)
TAXON_TO_INDEX.set('g__', 5)
TAXON_TO_INDEX.set('s__', 6)

const HEADERS = ['Release', 'Domain', 'Phylum', 'Class', 'Order', 'Family', 'Genus', 'Species']

export default Vue.extend({
  props: {
    search: {
      type: Object as PropType<TaxonHistorySearch>,
      required: true,
    },
  },
  watch: {
    search: {
      handler(after, before) {
        if (JSON.stringify(after) != JSON.stringify(before)) {
          this.updateTaxon();
        }
      },
      deep: true,
    },
  },
  data: () => ({
    header: [] as string[],
    rows: [] as TaxonomyOptionalRelease[],
    loading: false,

    request: null,
  }),
  mounted() {
    this.updateTaxon();
  },
  computed: {
    currentTaxonIndex(): number | undefined {
      return TAXON_TO_INDEX.get(this.search.taxon.substring(0, 3));
    },
  },
  methods: {
    updateTaxon() {
      if (this.search.taxon && this.search.taxon.length > 3) {
        this.loading = true;

        this.$api.taxonomy.partialSearchAllReleases(this.search.taxon)
          .then((resp) => {
            this.populateFromPayload(resp.data);
          })
          .catch((err) => {
            console.log(err);
            this.$accessor.api.defaultCatch(err);
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        this.header = [];
        this.rows = [];
      }
    },
    populateFromPayload(payload: TaxonomyOptionalRelease[]) {
      // Determine the range of releases that are allowed
      const allowedReleases = [] as string[];
      TaxonHistoryReleases.slice(TaxonHistoryReleases.indexOf(this.search.from),
        TaxonHistoryReleases.indexOf(this.search.to) + 1).forEach((release) => {
        if (release === TaxonHistoryRelease.NCBI) {
          allowedReleases.push(release);
        } else {
          allowedReleases.push(`R${release}`)
        }
      })

      const rows = [] as TaxonomyOptionalRelease[];
      payload.forEach((item) => {
        // Omit items that are not in the search range
        if (allowedReleases.indexOf(item.release as TaxonHistoryRelease) > -1) {
          rows.push(item);
        }

      });
      const headerLimit = this.currentTaxonIndex != null ? this.currentTaxonIndex + 2 : undefined;
      this.header = HEADERS.slice(0, headerLimit);
      this.rows = rows;
    }
  }
})
</script>

<style scoped>

</style>
