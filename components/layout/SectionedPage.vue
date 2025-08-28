<template>
  <v-row no-gutters>

    <!-- Floating navigation drawer (for small screens) -->
    <v-navigation-drawer
      v-model="drawer"
      class="hidden-md-and-up"
      fixed
      style="width: 80%"
    >
      <v-list dense nav>
        <v-list-item-group
          v-model="selectedIndex"
          color="primary"
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

    <!-- Fixed navigation columns (for medium+ devices) -->
    <v-col class="hidden-sm-and-down pr-5" cols="3">
      <v-list class="mt-14" dense rounded style="position: sticky; top: 100px;">
        <v-list-item-group
          v-model="selectedIndex"
          color="primary"
        >
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :href="`#${item.ref}`"
            @click="selectItem(i)"
            class="small-list-item"
          >
            <v-list-item-content class="my-1">
              <v-list-item-title v-text="item.text" class="nav-list-title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-col>

    <!-- Main content (for all devices) -->
    <v-col class="col-12 col-md-9">
      <v-card>

        <v-card-title class="text-h5 card-title">
          <slot name="title"/>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text>


        <v-card
          v-for="(item, index) in items"
          :key="index"
          :ref="item.ref"
          class="mt-5"
          flat
          outlined
        >
          <v-card-title class="sectionTitle font-weight-regular">
            {{ item.text }}
          </v-card-title>
          <v-card-text class="pt-3">
            <slot :name="item.ref"/>
          </v-card-text>
        </v-card>
  <!-- Spacer ensures last section can scroll fully -->
  <div style="height: 200px;"></div>
        </v-card-text>
      </v-card>

    </v-col>

  </v-row>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {SectionedPageItems} from "~/assets/ts/interfaces";
import {mdiArrowCollapseRight} from "@mdi/js";

const SCROLL_OFFSET = -60;


export default Vue.extend({
  props: {
    items: [] as PropType<SectionedPageItems[]>
  },
  data: () => ({
    selectedIndex: 0,
    isScrolling: false,
    drawer: false,
    mdiArrowCollapseRightSvg: mdiArrowCollapseRight,
  }),
  methods: {
    selectItem(index: number) {
      this.selectedIndex = index;
      this.scrollToSelected();
    },
    // scrollToSelected() {
    //   const curEle = (this.$refs[this.items[this.selectedIndex].ref] as Vue[]);
    //   this.$vuetify.goTo(curEle[0], {offset: 10})
    // },
scrollToSelected() {
  const item = this.items[this.selectedIndex];
  if (!item) return;

  const curEle = this.$refs[item.ref] as Vue[];
  if (!curEle || !curEle[0]) return;

  // Disable onScroll updates
  this.isScrolling = true;

  this.$vuetify.goTo(curEle[0], { offset: 110 }).then(() => {
    // Re-enable after scroll is finished
    setTimeout(() => {
      this.isScrolling = false;
    }, 50); // small buffer to ensure scroll settles
  });
},
onScroll() {
  if (this.isScrolling) return; // skip updates while programmatic scrolling

  for (let i = 0; i < this.items.length; i++) {
    const curEle = this.$refs[this.items[i].ref] as Vue[];
    if (curEle && curEle[0]) {
      const curRect = (curEle[0].$el as Element).getBoundingClientRect();
      const topX = curRect.top + SCROLL_OFFSET;
      const botX = topX + curRect.height + SCROLL_OFFSET;
      if (topX > 0 || botX > 0) {
        if (this.selectedIndex !== i) {
          this.selectedIndex = i;
        }
        break;
      }
    }
  }
}
  },
  mounted() {
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
  destroyed() {
    window.removeEventListener('scroll', this.onScroll);
  },
})
</script>

<style scoped>
.v-item--active, .v-list-item--active {
  background-color: #5a6855;
  color: white;
}

.sectionTitle {
  background-color: #efefef;
  overflow-wrap: break-word;
  word-break: break-word;
}

.small-list-item {
  min-height: 30px !important;
}
.small-list-item .v-list-item__content, .v-list--dense .v-list-item .v-list-item__content {
  padding: 0 !important;
}

.nav-list-title {
  white-space: pre-wrap !important;
}

</style>
