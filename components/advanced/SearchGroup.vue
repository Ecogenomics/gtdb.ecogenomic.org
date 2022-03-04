<template>
  <v-row align="center" class="py-1" no-gutters>

    <!-- Match type -->
    <v-row align="center" class="pl-1" no-gutters>
      Match
      <v-select
        v-model="initialNodeMatchType"
        :items="items"
        background-color="white"
        class="px-2"
        dense
        hide-details
        outlined
        style="max-width: 115px;"
        @input="setMatchType"
      ></v-select>
      of the following:

      <v-tooltip open-delay="150" top transition="slide-x-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs"
                 v-on="on"
                 class="ml-3"
                 color="rgb(89 150 50)"
                 elevation="0"
                 x-small
                 fab
                 @click="addRule">
            <v-icon  color="#ecffe0">
              {{  mdiFilterPlusSvg }}
            </v-icon>
          </v-btn>
        </template>
        <span>Add Rule</span>
      </v-tooltip>

    </v-row>

    <!-- Buttons -->
    <div class="d-flex pr-2">
      <v-spacer></v-spacer>

      <!-- Add a child search group -->
      <v-tooltip open-delay="150" top transition="slide-x-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs"
                 v-on="on"
                 :disabled="!hasChildNodes"
                 color="rgb(89 150 50)"
                 elevation="0"
                 x-small
                 fab
                 @click="addGroup">
            <v-icon color="#ffffff">
              {{mdiFolderPlusSvg }}
            </v-icon>
          </v-btn>
        </template>
        <span>Add Group</span>
      </v-tooltip>

      <!-- Remove this search group -->
      <v-tooltip open-delay="150" top transition="slide-x-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-if="node.id !== 0"
                 v-bind="attrs" v-on="on"
                 color="rgb(204 53 48)"
                 class="ml-1"
                 elevation="0"
                 x-small
                 fab
                 @click="removeGroup"
          >
            <v-icon color="#ffffff">
              {{  mdiFolderRemoveSvg }}
            </v-icon>
          </v-btn>
        </template>
        <span>Remove Group</span>
      </v-tooltip>

    </div>
  </v-row>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue'
import {NodeGroup, NodeGroupMatchType} from "~/store/advanced";
import {COLOURS} from "~/assets/ts/common";
import {mdiFilterPlus, mdiFolderPlus, mdiFolderRemove} from '@mdi/js';

export default Vue.extend({
  name: "SearchGroup",
  components: {},
  props: {
    node: Object as PropType<NodeGroup>
  },
  computed: {
    initialNodeMatchType: {
      get: function () {
        return this.node.matchType
      },
      set: function () {
      }
    },
    hasChildNodes() {
      return this.node.children.length > 0;
    },
    groupHex() {
      return COLOURS[(this as any).node.id % COLOURS.length];
    }
  },
  data: () => ({
    items: Object.values(NodeGroupMatchType),
    mdiFilterPlusSvg: mdiFilterPlus,
    mdiFolderPlusSvg: mdiFolderPlus,
    mdiFolderRemoveSvg: mdiFolderRemove,
  }),
  methods: {
    setMatchType(val: NodeGroupMatchType) {
      this.$accessor.advanced.setNodeGroupMatchType({
        node: this.node,
        type: val,
      })
    },
    addGroup() {
      this.$accessor.advanced.addGroupToNode(this.node);
    },
    removeGroup() {
      this.$accessor.advanced.removeNode(this.node);
    },
    addRule() {
      this.$accessor.advanced.addRuleToNode(this.node);
    },
  }
})
</script>

<style scoped>
</style>
