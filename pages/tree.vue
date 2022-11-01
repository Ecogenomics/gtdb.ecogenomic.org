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
              dense
              v-model="showDescGenomes"
              class="font-12px"
              label="Genomes"
              hide-details
            ></v-checkbox>
          </v-row>
          <v-row no-gutters>
            <v-checkbox
              dense
              color="#9e94ca"
              v-model="showDescChildren"
              class="font-12px"
              label="Children"
              hide-details
            ></v-checkbox>
            <TreePopUpHelp class="ml-3 my-auto"></TreePopUpHelp>
          </v-row>
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

    <v-card style="min-height: 600px;">
      <v-card-title class="text-h4">
        Tree
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="text--primary">
        <v-row no-gutters>

          <!-- Left column -->
          <v-col>
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
              <template v-slot:prepend="{ item }">
                <!-- Surround every node with a tooltip -->
                <div :ref="taxonToTreeNodeRef(item.taxon)">

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
                      `treeNodeActive treeNode rounded py-1 px-2 ${getTreeNodeClass(item)}` :
                       `treeNode rounded py-1 px-2 ${getTreeNodeClass(item)}`">

                      <!-- Add the taxon name -->
                      {{ item.taxon }}

                      <!-- Add the genome count -->
                      <v-chip v-if="showDescGenomes" x-small color="#e3e3e3" class="ml-2">
                        {{ item.total ? item.total.toLocaleString() : 'loading...' }}
                      </v-chip>

                      <!-- Add the taxon count -->
                      <v-chip v-if="showDescChildren && item.nDescChildren" x-small color="#9e94ca" class="m-2 chip-white">
                        {{ item.nDescChildren.toLocaleString() }}
                      </v-chip>

                      <!-- Append the taxon not in literature icon if required -->
                      <template v-if="taxaNotInLit[item.taxon.substring(3)]">
                        <TaxonNotInLit v-if="taxaNotInLit[item.taxon.substring(3)]"
                                       :tooltip="taxaNotInLit[item.taxon.substring(3)]"/>
                      </template>

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
          <v-col class="hidden-md-and-down" cols="3">

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
                    dense
                    v-model="showDescGenomes"
                    class="font-12px"
                    label="Genomes"
                    hide-details
                  ></v-checkbox>
                </v-row>
                <v-row no-gutters>
                  <v-checkbox
                    dense
                    color="#9e94ca"
                    v-model="showDescChildren"
                    class="font-12px"
                    label="Children"
                    hide-details
                  ></v-checkbox>
                  <TreePopUpHelp class="ml-3 my-auto"></TreePopUpHelp>
                </v-row>
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
import {mdiArrowCollapseRight, mdiArrowLeftDropCircle, mdiUndo} from "@mdi/js";
import TreeLegend from "~/components/tree/TreeLegend.vue";
import TaxonSearchAutocomplete from "~/components/shared/TaxonSearchAutocomplete.vue";
import {TaxonomyOptional} from "~/assets/api/taxonomy";
import TreeFullTaxonomy from "~/components/tree/TreeFullTaxonomy.vue";
import {Dict} from "~/assets/ts/interfaces";
import TaxonNotInLit from "~/components/browse/TaxonNotInLit.vue";
import TreePopUpHelp from "~/components/tree/TreePopUpHelp.vue";

export default Vue.extend({
  head() {
    return {
      title: 'Tree',
      meta: [
        {
          hid: 'tree',
          name: 'description',
          content: `Explore the GTDB tree in the browser.`
        }
      ]
    }
  },
  components: {TreePopUpHelp, TreeFullTaxonomy, TaxonSearchAutocomplete, TreeLegend, TaxonNotInLit},

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
    showDescGenomes: true
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
          this.$router.replace({query})
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
      return this.$accessor.tree.loadChildren(item);
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
