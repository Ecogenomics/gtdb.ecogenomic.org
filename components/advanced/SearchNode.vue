<template>
    <v-row
      :style="rowStyle"
      class="flex-nowrap containerStyle rounded my-1 px-2"
      no-gutters
    >
      <v-col cols="12">

        <!-- Inject the group node if this is a group -->
        <SearchGroup v-if="isGroup" :node="node"></SearchGroup>

        <!-- Inject the rule node if this is a rule -->
        <SearchRule v-if="isRule" :node="node"></SearchRule>

        <!-- Recursively build the search tree -->
        <SearchNode
          v-for="childNode in node.children"
          v-if="node"
          :key="childNode.id"
          :depth="depth + 1"
          :node="childNode"
        >
        </SearchNode>
      </v-col>
    </v-row>
</template>

<script lang="ts">
import SearchGroup from '~/components/advanced/SearchGroup.vue'
import SearchRule from '~/components/advanced/SearchRule.vue'
import Vue, {PropType} from 'vue'
import {BaseNode, NodeGroup, NodeRule, NodeType} from "~/store/advanced";
import {COLOURS, hexToRGBA} from '~/assets/ts/common'

export default Vue.extend({
  props: {
    depth: Number,
    node: Object as PropType<NodeGroup | NodeRule>,
  },
  name: 'SearchNode',
  components: {
    SearchGroup,
    SearchRule
  },
  computed: {
    rowStyle() {
      const style = [];
      if (this.isGroup) {
        const curHex = COLOURS[(this as any).node.id % COLOURS.length];
        style.push(`border-width: 1px 1px 1px 10px`)
        style.push(`border-color: black black black ${curHex}`)
        style.push(`background-color: ${hexToRGBA(curHex, 0.1)}`)
      } else {
        style.push(`border-width: 1px`)
        style.push(`border-color: #949494`)
      }
      return style.join('; ')
    },
    isGroup(): boolean {
      return (this.node as BaseNode).type === NodeType.GROUP;
    },
    isRule() {
      return (this.node as BaseNode).type === NodeType.RULE;
    },
    canRemoveGroup() {
      return (this.node as BaseNode).id !== 0 && (this as any).isGroup;
    },
  },
})
</script>

<style scoped>
.containerStyle {
  border-style: solid;
}
</style>
