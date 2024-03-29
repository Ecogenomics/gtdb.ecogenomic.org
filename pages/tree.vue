<template>
  <v-container class="gtdb-container">

    <!-- Floating navigation drawer (for small screens) -->
    <v-navigation-drawer
      v-model="drawer"
      class="hidden-md-and-up"
      fixed
      style="width: 80%"
    >
      <div class="pa-2">
        <!-- Reset tree button -->
        <v-btn
          depressed
          width="100%"
          @click="resetTree"
        >
          Reset Tree
          <v-icon
            right
          >
            {{ mdiUndoSvg }}
          </v-icon>
        </v-btn>

        <!-- Search for a taxon -->
        <TaxonSearchAutocomplete
          v-model="searchForTaxon"
          class="mt-5"
          label="Search for a taxon"
        />

        <!-- Tree legend -->
        <TreeLegend
          class="pa-2 mt-5"
        />

        <!-- Annotations selection options -->
        <div class="treeAnnotation rounded-lg mt-5 pa-2" style="font-size: 12px;">
          <v-row no-gutters>
            <b>Counts</b>
          </v-row>
          <v-row no-gutters>
            <v-checkbox
              v-model="showDescGenomes"
              class="font-12px"
              dense
              hide-details
              label="Genomes"
            ></v-checkbox>
          </v-row>
          <v-row no-gutters>
            <v-checkbox
              v-model="showDescChildren"
              class="font-12px"
              color="#9e94ca"
              dense
              hide-details
              label="Children"
            >
              <template v-slot:append>
                <TreePopUpHelp class="ml-3 my-auto"></TreePopUpHelp>
              </template>
            </v-checkbox>

          </v-row>
        </div>

        <!-- Link annotation selection options -->
        <div class="treeAnnotation rounded-lg mt-5 pa-2" style="font-size: 12px;">
          <v-row no-gutters>
            <b>External Resources</b>
          </v-row>
          <v-row no-gutters>
            <v-checkbox
              v-model="showBergeysUrl"
              class="font-12px"
              color="#d5a747"
              dense
              hide-details
              label="Bergey's Manual"
            >
              <template v-slot:append>
                <TreePopUpBergeysHelp class="ml-3 my-auto"></TreePopUpBergeysHelp>
              </template>
            </v-checkbox>
          </v-row>
          <v-row no-gutters>
            <v-checkbox
              v-model="showLpsnUrl"
              class="font-12px"
              color="#9a489c"
              dense
              hide-details
              label="LPSN"
              @click="onShowLpsnUrl"
            >
              <template v-slot:append>
                <TreePopUpLpsnHelp class="ml-3 my-auto"></TreePopUpLpsnHelp>
              </template>
            </v-checkbox>
          </v-row>
          <v-row no-gutters>
            <v-checkbox
              v-model="showNcbiUrl"
              class="font-12px"
              color="#21568a"
              dense
              hide-details
              label="NCBI"
              @click="onShowNcbiUrl"
            >
              <template v-slot:append>
                <TreePopUpShowUrlGeneric
                  class="ml-3 my-auto"
                  color="#21568a"
                >
                  <template v-slot:title>NCBI</template>
                  <template v-slot:content>
                    <p>
                      Links have been created to NCBI taxonomy based on verbatim name matching, not all taxa have been
                      matched.
                    </p>
                    <p>
                      A best effort has been made to ensure that all taxa in NCBI are mapped to their corresponding
                      GTDB taxon. Please
                      <nuxt-link to="contact">contact us</nuxt-link>
                      if you notice any mistakes.
                    </p>
                  </template>
                </TreePopUpShowUrlGeneric>
              </template>
            </v-checkbox>
          </v-row>
          <v-row no-gutters>
            <v-checkbox
              v-model="showSeqCodeUrl"
              class="font-12px"
              color="#4b0082"
              dense
              hide-details
              label="SeqCode"
              @click="onShowSeqCodeUrl"
            >
              <template v-slot:append>
                <TreePopUpShowUrlGeneric
                  class="ml-3 my-auto"
                  color="#4b0082"
                >
                  <template v-slot:title>SeqCode</template>
                  <template v-slot:content>
                    <p>
                      Links have been created to SeqCode taxa based on verbatim name matching, not all taxa have
                      been matched.
                    </p>
                    <p>
                      A best effort has been made to ensure that all taxa in SeqCode are mapped to their
                      corresponding GTDB taxon. Please
                      <nuxt-link to="contact">contact us</nuxt-link>
                      if you notice any mistakes.
                    </p>
                  </template>
                </TreePopUpShowUrlGeneric>
              </template>
            </v-checkbox>
          </v-row>
          <!--          <v-row no-gutters>-->
          <!--            <v-checkbox-->
          <!--              v-model="showSeqcodeUrl"-->
          <!--              class="font-12px"-->
          <!--              color="#4b0082"-->
          <!--              dense-->
          <!--              hide-details-->
          <!--              label="SeqCode"-->
          <!--            >-->
          <!--            </v-checkbox>-->
          <!--          </v-row>-->
        </div>

      </div>
    </v-navigation-drawer>

    <!-- Floating button to open/close navigation drawer (for small screens) -->
    <v-col class="hidden-md-and-up" style="flex: 0 0 30px; max-width: 30px;">
      <v-btn
        v-if="!drawer"
        class="hidden-md-and-up"
        fab
        fixed
        small
        style="z-index: 1; left: 7px; top: 50%;"
        @click.stop="drawer = !drawer"
      >
        <v-icon>
          {{ mdiArrowCollapseRightSvg }}
        </v-icon>
      </v-btn>
    </v-col>

    <v-card style="min-height: 700px;">
      <v-card-title class="text-h4">
        Tree
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="text--primary">
        <v-row no-gutters>

          <!-- Left column -->
          <v-col>

            <!-- For each of the items in the treeview, run the slot code below -->
            <v-treeview
              :items="getItems"
              :load-children="getChildren"
              :open.sync="getOpen"
              class="gtdb-treeview"
              dense
              item-key="taxon"
              open-on-click
              transition
            >

              <!-- This block is a template for each of the tree nodes -->
              <template v-slot:label="{ item }">

                <!-- Surround every node with a reference for programmatic use later -->
                <div :ref="taxonToTreeNodeRef(item.taxon)" class="d-flex">

                  <!-- This is a genome (leaf node) -->
                  <template v-if="item.isGenome">
                    <template v-if="item.hideLink">
                      <nuxt-link :to="`/species?id=${item.species.substring(3)}`">
                        <div :class="`${getTreeNodeClass(item)} + rounded py-1 px-2`">
                          {{ item.taxon }}
                        </div>
                      </nuxt-link>
                    </template>
                    <template v-else>
                      <NuxtLink :to="{name: 'genome',
                      query: {
                        gid: item.taxon.startsWith('GB_') ? item.taxon.substring(3) :
                        item.taxon.startsWith('RS_') ? item.taxon.substring(3) : item.taxon
                      }}"
                      >
                        <div :class="`${getTreeNodeClass(item)} + rounded py-1 px-2`">
                       <span v-if="item.isGtdbSpeciesRep">
                        *
                      </span>
                          {{
                            item.taxon.startsWith('GB_') ? item.taxon.substring(3) :
                              item.taxon.startsWith('RS_') ? item.taxon.substring(3) : item.taxon
                          }}
                        </div>
                      </NuxtLink>
                    </template>
                  </template>

                  <!-- This is a taxon (internal node) -->
                  <template v-else>
                    <div
                      :class="getActive.includes(item.taxon) ?
                      `d-flex treeNodeActive treeNode rounded py-1 px-2 ${getTreeNodeClass(item)}` :
                       `d-flex treeNode rounded py-1 px-2 ${getTreeNodeClass(item)}`">

                      <!-- Add the taxon name -->
                      {{ item.taxon }}

                      <!-- Add the genome count -->
                      <v-chip v-if="showDescGenomes" class="ml-2 my-auto" color="#e3e3e3" x-small>
                        {{ item.total ? item.total.toLocaleString() : 'loading...' }}
                      </v-chip>

                      <!-- Add the taxon count -->
                      <v-chip v-if="showDescChildren && item.nDescChildren" class="ml-1 my-auto chip-white"
                              color="#9e94ca"
                              x-small>
                        {{ item.nDescChildren.toLocaleString() }}
                      </v-chip>

                      <!-- Append the taxon not in literature icon if required -->
                      <template v-if="taxaNotInLit[item.taxon.substring(3)]">
                        <TaxonNotInLit v-if="taxaNotInLit[item.taxon.substring(3)]"
                                       :tooltip="taxaNotInLit[item.taxon.substring(3)]"/>
                      </template>

                    </div>

                    <!-- Additional links to the right side -->
                    <div class="d-flex ml-2 my-auto">

                      <!-- Bergeys URL -->
                      <v-btn
                        v-if="showBergeysUrl && item.bergeysUrl"
                        :href="item.bergeysUrl"
                        class="tree-icon mr-1"
                        color="#d5a747"
                        depressed
                        height="24px"
                        target="_blank"
                        x-small
                      >
                        <span class="tree-icon-text">BM</span>
                      </v-btn>

                      <!-- LPSN URL -->
                      <v-btn
                        v-if="showLpsnUrl && item.lpsnUrl"
                        :href="item.lpsnUrl"
                        class="tree-icon mr-1"
                        color="#9a499c"
                        depressed
                        height="24px"
                        target="_blank"
                        x-small
                      >
                        <span class="tree-icon-text">LPSN</span>
                      </v-btn>

                      <!-- NCBI URL -->
                      <v-btn
                        v-if="showNcbiUrl && item.ncbiTaxId"
                        :href="`https://www.ncbi.nlm.nih.gov/data-hub/taxonomy/${item.ncbiTaxId}/`"
                        class="tree-icon mr-1"
                        color="#21568a"
                        depressed
                        height="24px"
                        target="_blank"
                        x-small
                      >
                        <span class="tree-icon-text">NCBI</span>
                      </v-btn>

                      <!-- SeqCode URL -->
                      <v-btn
                        v-if="showSeqCodeUrl && item.seqcodeUrl"
                        :href="item.seqcodeUrl"
                        class="tree-icon mr-1"
                        color="#4b0082"
                        depressed
                        height="24px"
                        target="_blank"
                        x-small
                      >
                        <span class="tree-icon-text">SC</span>
                      </v-btn>

                    </div>
                  </template>
                </div>
              </template>

              <!-- Arrow at right hand side if this is an active taxon -->
              <template v-slot:append="{ item }">
                <v-icon v-if="getActive.includes(item.taxon)" color="#8bc34a">
                  {{ mdiArrowLeftDropCircleSvg }}
                </v-icon>
              </template>

            </v-treeview>
          </v-col>
          <!-- End left column -->

          <!-- Right column -->
          <v-col class="hidden-sm-and-down" cols="3">

            <!-- Fix content within column -->
            <div style="position:fixed; min-width: 200px;">

              <!-- Reset tree button -->
              <v-btn
                depressed
                @click="resetTree"
              >
                Reset Tree
                <v-icon
                  right
                >
                  {{ mdiUndoSvg }}
                </v-icon>
              </v-btn>

              <!-- Search for a taxon -->
              <TaxonSearchAutocomplete
                v-model="searchForTaxon"
                class="mt-5"
                label="Search for a taxon"
              />

              <!-- Tree legend -->
              <TreeLegend
                class="pa-2 mt-5"
              />

              <!-- Annotations selection options -->
              <div class="treeAnnotation rounded-lg mt-5 pa-2" style="font-size: 12px;">
                <v-row no-gutters>
                  <b>Counts</b>
                </v-row>
                <v-row no-gutters>
                  <v-checkbox
                    v-model="showDescGenomes"
                    class="font-12px"
                    dense
                    hide-details
                    label="Genomes"
                  ></v-checkbox>
                </v-row>
                <v-row no-gutters>
                  <v-checkbox
                    v-model="showDescChildren"
                    class="font-12px"
                    color="#9e94ca"
                    dense
                    hide-details
                    label="Children"
                  >
                    <template v-slot:append>
                      <TreePopUpHelp class="ml-3 my-auto"></TreePopUpHelp>
                    </template>
                  </v-checkbox>
                </v-row>
              </div>

              <!-- Link annotation selection options -->
              <div class="treeAnnotation rounded-lg mt-5 pa-2" style="font-size: 12px;">
                <v-row no-gutters>
                  <b>External Resources</b>
                </v-row>
                <v-row no-gutters>
                  <v-checkbox
                    v-model="showBergeysUrl"
                    class="font-12px"
                    color="#d5a747"
                    dense
                    hide-details
                    label="Bergey's Manual"
                    @click="onShowBergeysUrl"
                  >
                    <template v-slot:append>
                      <TreePopUpBergeysHelp class="ml-3 my-auto"></TreePopUpBergeysHelp>
                    </template>
                  </v-checkbox>
                </v-row>
                <v-row no-gutters>
                  <v-checkbox
                    v-model="showLpsnUrl"
                    class="font-12px"
                    color="#9a489c"
                    dense
                    hide-details
                    label="LPSN"
                    @click="onShowLpsnUrl"
                  >
                    <template v-slot:append>
                      <TreePopUpLpsnHelp class="ml-3 my-auto"></TreePopUpLpsnHelp>
                    </template>
                  </v-checkbox>
                </v-row>
                <v-row no-gutters>
                  <v-checkbox
                    v-model="showNcbiUrl"
                    class="font-12px"
                    color="#21568a"
                    dense
                    hide-details
                    label="NCBI"
                    @click="onShowNcbiUrl"
                  >
                    <template v-slot:append>
                      <TreePopUpShowUrlGeneric
                        class="ml-3 my-auto"
                        color="#21568a"
                      >
                        <template v-slot:title>NCBI</template>
                        <template v-slot:content>
                          <p>
                            Links have been created to NCBI taxonomy based on verbatim name matching, not all taxa have
                            been matched.
                          </p>
                          <p>
                            A best effort has been made to ensure that all taxa in NCBI are mapped to their
                            corresponding
                            GTDB taxon. Please
                            <nuxt-link to="contact">contact us</nuxt-link>
                            if you notice any mistakes.
                          </p>
                        </template>
                      </TreePopUpShowUrlGeneric>
                    </template>
                  </v-checkbox>
                </v-row>
                <v-row no-gutters>
                  <v-checkbox
                    v-model="showSeqCodeUrl"
                    class="font-12px"
                    color="#4b0082"
                    dense
                    hide-details
                    label="SeqCode"
                    @click="onShowSeqCodeUrl"
                  >
                    <template v-slot:append>
                      <TreePopUpShowUrlGeneric
                        class="ml-3 my-auto"
                        color="#4b0082"
                      >
                        <template v-slot:title>SeqCode</template>
                        <template v-slot:content>
                          <p>
                            Links have been created to SeqCode taxa based on verbatim name matching, not all taxa have
                            been matched.
                          </p>
                          <p>
                            A best effort has been made to ensure that all taxa in SeqCode are mapped to their
                            corresponding GTDB taxon. Please
                            <nuxt-link to="contact">contact us</nuxt-link>
                            if you notice any mistakes.
                          </p>
                        </template>
                      </TreePopUpShowUrlGeneric>
                    </template>
                  </v-checkbox>
                </v-row>
                <!--                <v-row no-gutters>-->
                <!--                  <v-checkbox-->
                <!--                    v-model="showSeqcodeUrl"-->
                <!--                    class="font-12px"-->
                <!--                    color="#4b0082"-->
                <!--                    dense-->
                <!--                    hide-details-->
                <!--                    label="SeqCode"-->
                <!--                  >-->
                <!--                  </v-checkbox>-->
                <!--                </v-row>-->
              </div>

              <!-- Taxonomy table for the selected taxon -->
              <!--              <TreeFullTaxonomy-->
              <!--                class="mt-5"-->
              <!--                :taxonomy="selectedTaxonomy"-->
              <!--              />-->


            </div>
          </v-col>
          <!-- End right column -->

        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import {TreeItem} from "~/store/tree";
import {mdiArrowCollapseRight, mdiArrowLeftDropCircle, mdiLinkVariant, mdiUndo} from "@mdi/js";
import TreeLegend from "~/components/tree/TreeLegend.vue";
import TaxonSearchAutocomplete from "~/components/shared/TaxonSearchAutocomplete.vue";
import {TaxonomyOptional} from "~/assets/api/taxonomy";
import TreeFullTaxonomy from "~/components/tree/TreeFullTaxonomy.vue";
import {Dict} from "~/assets/ts/interfaces";
import TaxonNotInLit from "~/components/browse/TaxonNotInLit.vue";
import TreePopUpHelp from "~/components/tree/TreePopUpHelp.vue";
import TreePopUpBergeysHelp from "~/components/tree/TreePopUpBergeysHelp.vue";
import TreePopUpLpsnHelp from "~/components/tree/TreePopUpLpsnHelp.vue";
import TreePopUpShowUrlGeneric from "~/components/tree/TreePopUpShowUrlGeneric.vue";

export default Vue.extend({
  head() {
    return {
      title: 'Tree',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `Explore the GTDB tree in the browser.`
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: `tree, taxonomy, taxa, phylogenetic, gtdb`
        }
      ],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `https://gtdb.ecogenomic.org/tree`,
        }
      ]
    }
  },
  components: {
    TreePopUpLpsnHelp,
    TreePopUpHelp,
    TreePopUpBergeysHelp,
    TreeFullTaxonomy,
    TaxonSearchAutocomplete,
    TreePopUpShowUrlGeneric,
    TreeLegend,
    TaxonNotInLit
  },

  // Load the initial content to be baked into the page
  async asyncData({$api}) {

    // Taxa not in literature
    const apiTaxaNotInLit = await $api.taxonomy.notInLit();
    const taxaNotInLit = {} as Dict<string>;
    apiTaxaNotInLit.data.forEach((taxon) => {
      taxaNotInLit[taxon.taxon] = `${taxon.taxonStatus} ${taxon.notes}`;
    });

    // Merge with data
    return {taxaNotInLit}
  },

  data: () => ({
    // Icons
    mdiUndoSvg: mdiUndo,
    mdiArrowLeftDropCircleSvg: mdiArrowLeftDropCircle,
    mdiArrowCollapseRightSvg: mdiArrowCollapseRight,
    mdiLinkVariantSvg: mdiLinkVariant,

    // Search for taxon input field - value not used, but watched for changes
    searchForTaxon: '',

    // The taxonomy string of the selected node
    selectedTaxonomy: {} as TaxonomyOptional,

    // Navigation drawer (for small screens)
    drawer: false,

    // Taxa not in literature tooltip
    taxaNotInLit: {} as Dict<string>,

    // Allow the user to select the following tree annotations
    showDescChildren: false,
    showDescGenomes: true,
    showBergeysUrl: false,
    showLpsnUrl: false,
    showSeqcodeUrl: false,
    showNcbiUrl: false,
    showSeqCodeUrl: false,
  }),
  watch: {
    // If the user searches for a taxon, manipulate the tree
    searchForTaxon(after: string, before: string) {
      if (after && after.length > 0 && after !== before) {
        this.openTreeToTaxon(after)
      } else {
        this.removeActiveTaxon();
      }
    }
  },
  computed: {
    // Returns the active node
    getActive(): string[] {
      return this.$accessor.tree.active
    },

    // Returns all the items in the tree
    getItems() {
      return this.$accessor.tree.items;
    },

    // Returns / sets the children of a given node
    getOpen: {
      get: function () {
        return this.$accessor.tree.open;
      },
      set: function (value: string[]) {
        // Update the URL path
        const query = Object.assign({}, this.$route.query);
        const newR = value[value.length - 1];
        if (newR && query.r !== newR) {
          query.r = newR;
          this.$router.replace({query}).catch(() => {
          });
        }
        // Set the value
        this.$accessor.tree.setOpen(value);
      }
    }
  },
  methods: {
    getTreeNodeClass(item: TreeItem) {
      if (item.isTypeSpeciesOfGenus) {
        return 'genomeTypeSpeciesOfGenus'
      } else if (item.isTypeStrainOfSpecies) {
        return 'genomeTypeStrainOfSpecies'
      } else if (item.isTypeStrainOfSubspecies) {
        return 'genomeTypeStrainOfSubSpecies'
      }
      if (item.isGenome) {
        return 'leaf-node'
      }
      return 'treeNode'
    },

    // Removes the "r" query parameter from the tree
    removeQueryParameters() {
      if (this.$route.query.r) {
        const query = Object.assign({}, this.$route.query);
        delete query.r;
        this.$router.push(query);
      }
    },

    // Returns a reference-friendly string for the tree node using the taxon name
    taxonToTreeNodeRef(taxon: string): string {
      return `treeNodeRef-${taxon.replace(' ', '-')}`;
    },

    // Gets the full 7 rank taxonomy then opens the tree to it
    openTreeToTaxon(taxon: string) {
      this.$api.taxonomy.partialSearch(taxon)
        .then(resp => {
          this.selectedTaxonomy = resp.data;
          const newTaxa = [];
          if (resp.data.d) {
            newTaxa.push(`d__${resp.data.d}`);
          }
          if (resp.data.p) {
            newTaxa.push(`p__${resp.data.p}`);
          }
          if (resp.data.c) {
            newTaxa.push(`c__${resp.data.c}`);
          }
          if (resp.data.o) {
            newTaxa.push(`o__${resp.data.o}`);
          }
          if (resp.data.f) {
            newTaxa.push(`f__${resp.data.f}`);
          }
          if (resp.data.g) {
            newTaxa.push(`g__${resp.data.g}`);
          }
          if (resp.data.s) {
            newTaxa.push(`s__${resp.data.s}`);
          }
          this.$accessor.tree.openTreeToPath(newTaxa)
          this.$accessor.tree.setActiveTaxon([taxon]);
          this.scrollToTreeNode(taxon);
        })
        .catch((err) => {
          this.$accessor.api.defaultCatch(err);
        })
    },

    // Resets the tree state by closing all open nodes and removing the active taxon
    resetTree() {
      this.$accessor.tree.setOpen([]);
      this.removeActiveTaxon();
      this.removeQueryParameters();
    },
    async getChildren(item: TreeItem) {
      console.log(item);
      await this.$accessor.tree.loadChildren(item);

      // Automatically open all descendants if they are of length 1
      if (item && item.children && item.children.length === 1) {
        // Clone the getOpen array
        const newOpen = [...this.getOpen];

        let curItem = item.children[0];
        while (true) {
          await this.$accessor.tree.loadChildren(curItem);
          newOpen.push(curItem.taxon);
          if (curItem && curItem.children && curItem.children.length === 1) {
            curItem = curItem.children[0];
          } else {
            break;
          }
        }
        this.getOpen = newOpen;
      }
    },
    removeActiveTaxon() {
      this.$accessor.tree.setActiveTaxon([])
    },

    // Perform a series of checks to wait until the node exists, then scrolls to it.
    async scrollToTreeNode(taxon: string) {
      let nChecks = 0;
      let checkIt = setInterval(() => {
        const ele = this.$refs[this.taxonToTreeNodeRef(taxon)] as HTMLElement;
        if (ele) {
          setTimeout(() => {
            this.$vuetify.goTo(ele)
          }, 200);
          clearInterval(checkIt);
        }
        // Don't loop forever
        nChecks++;
        if (nChecks > 300) {
          console.log(`Unable to find node: ${taxon}`)
          clearInterval(checkIt);
        }
      }, 100)
    },

    // Make the tree state match the URL query
    initFromUrlParams() {
      if (this.$route.query.r) {
        return this.openTreeToTaxon(this.$route.query.r.toString());
      }
    },

    onShowBergeysUrl() {
      if (this.showBergeysUrl) {
        this.$plausible.trackEvent("Show Bergey's Manual");
      }
    },
    onShowLpsnUrl() {
      if (this.showLpsnUrl) {
        this.$plausible.trackEvent("Show LPSN URL");
      }
    },
    onShowNcbiUrl() {
      if (this.showNcbiUrl) {
        this.$plausible.trackEvent("Show NCBI URL");
      }
    },
    onShowSeqCodeUrl() {
      if (this.showSeqCodeUrl) {
        this.$plausible.trackEvent("Show SeqCode URL");
      }
    },
  },
  mounted() {
    this.$accessor.tree.initTreeState();
    this.initFromUrlParams();
  }
})
</script>

<style>
.v-treeview--dense .v-treeview-node__root {
  min-height: 36px;
}

</style>

<style scoped>
.treeNode {
  background-color: #a9c3b0;
  border-color: #687564;
  border-style: solid;
  border-width: 1px;
}

.treeNodeActive {
  background-color: #c8e0c1;
}

.genomeTypeSpeciesOfGenus {
  background-color: #e8c0bb;
}

.genomeTypeStrainOfSpecies {
  background-color: #e7dbc5;
}

.genomeTypeStrainOfSubSpecies {
  background-color: #d0e0e5;
  border: 1px solid #6aa3b4;
}

.leaf-node {
  background-color: #a9c3b0;
  border-color: #687564;
  border-style: solid;
  border-width: 1px;
}

.gtdb-treeview >>> a {
  color: #000000;
  text-decoration: none;
}

@media (max-width: 575px) {
  .title-primary {
    font-size: 22px;
  }

}

@media (min-width: 576px) and (max-width: 767px) {
  .title-primary {
    font-size: 48px;
  }

  .title-second {
    font-size: 18px;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .title-primary {
    font-size: 48px;
  }

  .title-second {
    font-size: 18px;
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .title-primary {
    font-size: 62px;
  }

  .title-second {
    font-size: 21px;
  }
}

@media (min-width: 1200px) {
  .title-primary {
    font-size: 62px;
  }

  .title-second {
    font-size: 21px;
  }
}

.treeAnnotation {
  background-color: #f5f5f5;
  border-color: #e1e1e1;
  border-style: solid;
  border-width: 1px;
}


</style>

<style>
.font-12px .v-label {
  font-size: 13px !important;
}

/*.chip-white .v-chip__content {*/
/*  color: white;*/
/*}*/
</style>


<style scoped>
.tree-icon {
  padding-left: 1px !important;
  padding-right: 1px !important;
}

.tree-icon-text {
  color: #FFFFFF;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0;
}
</style>
