<template>
  <v-simple-table
    dense
    style="border: 1px #d7d7d7 solid;"
  >
    <template v-slot:default>
      <tbody>
      <tr>
        <td class="gtdb-green-bg-table rounded-tl">
          Domain
        </td>
        <td>
          <nuxt-link :to="`tree?r=d__${encodeURIComponent(taxonomy.d)}`">
            {{ taxonomy.d }}
          </nuxt-link>
        </td>
      </tr>
      <tr>
        <td class="gtdb-green-bg-table">
          Phylum
        </td>
        <td>
          <nuxt-link :to="`tree?r=p__${encodeURIComponent(taxonomy.p)}`">
            {{ taxonomy.p }}
          </nuxt-link>
        </td>
      </tr>
      <tr>
        <td class="gtdb-green-bg-table">
          Class
        </td>
        <td>
          <nuxt-link :to="`tree?r=c__${encodeURIComponent(taxonomy.c)}`">
            {{ taxonomy.c }}
          </nuxt-link>
        </td>
      </tr>
      <tr>
        <td class="gtdb-green-bg-table ">
          Order
        </td>
        <td>
          <nuxt-link :to="`tree?r=o__${encodeURIComponent(taxonomy.o)}`">
            {{ taxonomy.o }}
          </nuxt-link>
        </td>
      </tr>
      <tr>
        <td class="gtdb-green-bg-table ">
          Family
        </td>
        <td>
          <nuxt-link :to="`tree?r=f__${encodeURIComponent(taxonomy.f)}`">
            {{ taxonomy.f }}
          </nuxt-link>
        </td>
      </tr>
      <tr>
        <td class="gtdb-green-bg-table">
          Genus
        </td>
        <td>
          <nuxt-link :to="`tree?r=g__${encodeURIComponent(taxonomy.g)}`">
            {{ taxonomy.g }}
          </nuxt-link>
        </td>
      </tr>
      <tr>
        <td class="gtdb-green-bg-table rounded-bl">
          Species
        </td>
        <td>
          <nuxt-link :to="`tree?r=s__${encodeURIComponent(taxonomy.s)}`">
            {{ taxonomy.s }}
          </nuxt-link>
        </td>
      </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue'
import {TaxonomyOptional} from "~/assets/api/taxonomy";

export default Vue.extend({
  props: {
    taxonomy: {
      type: Object as PropType<TaxonomyOptional>,
      required: true
    },
  }
})
</script>

<style scoped>

</style>
