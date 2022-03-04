<template>
  <div
    :class="getMainClass"
    style="font-size: 14px; color: white;"
  >


    <!-- Each rank -->
    <div
      v-for="(row, index) in getRows"
      :key="index"
      :class="getRowClass"
    >

      <!-- Rank -->
      <div
        :class="getRankContainerClass"
        style="min-width: 15%;"
      >
        <div :class="getRankClass">
          <a :href="getTreeUrl" class="no-hover ">
            {{ row.rank.toUpperCase() }}
          </a>
        </div>
      </div>

      <!-- Bar -->
      <div
        :style="`max-width: ${row.width.toString()}%;`"
        class="d-flex flex-grow-1 rounded-sm taxBar"
      >
        <a :href="getTreeUrl" class="no-hover w-100"></a>
      </div>

      <!-- Count -->
      <div
        :class="getCountClass"
      >
        <a :href="getTreeUrl" class="no-hover">
          {{ row.count.toLocaleString() }}
        </a>
      </div>

    </div>


    <div
      :style="getDomainStyle"
      class="d-flex gtdb-col-header"
    >
      {{ d.toUpperCase() }} ({{ total.toLocaleString() }})
    </div>

  </div>
</template>


<script lang="ts">
import Vue from 'vue';

interface RankRow {
  rank: string;
  count: number;
  width: number;
}

export default Vue.extend({
  props: {
    p: Number,
    c: Number,
    o: Number,
    f: Number,
    g: Number,
    s: Number,
    total: Number,
    d: String
  },
  data: () => ({}),
  computed: {
    getTreeUrl(): string {
      if (this.isBac) {
        return '/tree?r=d__Bacteria'
      } else {
        return '/tree?r=d__Archaea'
      }
    },
    isBac(): boolean {
      return this.d?.toLowerCase() === 'bacteria';
    },
    getRows(): RankRow[] {
      const out: RankRow[] = [];
      out.push({rank: 'Phylum', count: this.p, width: this.getWidth(this.p)});
      out.push({rank: 'Class', count: this.c, width: this.getWidth(this.c)});
      out.push({rank: 'Order', count: this.o, width: this.getWidth(this.o)});
      out.push({rank: 'Family', count: this.f, width: this.getWidth(this.f)});
      out.push({rank: 'Genus', count: this.g, width: this.getWidth(this.g)});
      out.push({rank: 'Species', count: this.s, width: this.getWidth(this.s)});
      return out;
    },

    getMainClass(): string {
      const style = [
        'd-flex',
        'flex-grow-1'
      ];
      if (this.isBac) {
        style.push('flex-column-reverse')
      } else {
        style.push('flex-column')
      }
      return style.join(' ');
    },
    getRowClass(): string {
      const style = [
        'mt-1',
        'd-flex',
        'tree-corner'
      ];
      if (!this.isBac) {
        style.push('flex-row-reverse')
      }
      return style.join(' ');
    },
    getRankContainerClass(): string {
      const style = [
        'd-flex'
      ]
      if (this.isBac) {
        style.push('mr-1')
      } else {
        style.push('ml-1')
      }
      return style.join(' ');
    },
    getRankClass(): string {
      const style = [
        'd-flex'
      ];
      if (this.isBac) {
        style.push('ml-auto')
        style.push('mr-0')
      }
      return style.join(' ');
    },
    getCountClass(): string {
      const style = [
        'd-flex'
      ];
      if (this.isBac) {
        style.push('text-left')
        style.push('ml-1')
      } else {
        style.push('text-right')
        style.push('mr-1')
      }
      return style.join(' ');
    },
    getDomainStyle(): string {
      const style = []
      if (this.isBac) {
        style.push('margin-left: 15%;')
      } else {
        style.push('margin-right: 15%;')
        style.push('margin-left: auto;')
      }
      return style.join(' ');
    }
  },
  methods: {
    getWidth(count: number): number {
      const buffer = 1;
      return Math.min((count / this.s * 100) + buffer, 100);
    }
  },

})
</script>

<style scoped>
.taxBar {
  background-color: white;
}

.taxBar:hover {
  background-color: #e8e8e8;
}

.no-hover {
  text-decoration: none;
  font-weight: normal;
  color: #FFFFFF;
  border: none;
  outline: 0;
}

@media (max-width: 575px) {
  .gtdb-col-header {
    font-size: 12px;
  }

  .tree-corner {
    font-size: 8px;
    line-height: 8px;
  }
}

@media (min-width: 576px) and (max-width: 767px) {
  .gtdb-col-header {
    font-size: 12px;
  }

  .tree-corner {
    font-size: 10px;
    line-height: 10px;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .gtdb-col-header {
    font-size: 14px;
  }

  .tree-corner {
    font-size: 10px;
    line-height: 10px;
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .gtdb-col-header {
    font-size: 14px;
  }

  .tree-corner {
    font-size: 12px;
    line-height: 12px;
  }
}

@media (min-width: 1200px) {
  .gtdb-col-header {
    font-size: 16px;
  }

  .tree-corner {
    font-size: 14px;
    line-height: 14px;
  }
}
</style>
