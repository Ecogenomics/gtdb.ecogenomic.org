<template>
  <v-data-table
    :headers="headers"
    :items="rowsToDisplay"
    class="gtdb-table"
    dense
    item-key="taxon"
  >
    <template
      v-slot:top
    >
      <div class="d-flex align-center " style="background-color: #7a8a79;">
        <v-switch
          v-model="collapsePhyla"
          class="ml-auto mr-3"
          color="yellow"
          dense
          label="Group polyphyletic phyla"
        ></v-switch>
      </div>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from 'vue';

// Define an interface for what we expect a row to look like
interface PhylumPdRow {
  taxon: string;
  scaled: number;
  unscaled: number;
  abs: number;
}

function round(n: number, places: number) {
  return parseFloat(n.toFixed(places));
}

export default Vue.extend({
  props: {
    rows: {
      type: Array as () => PhylumPdRow[],
      required: true
    },
  },
  computed: {
    rowsToDisplay(): PhylumPdRow[] {

      // Then compute the rows to display
      if (this.collapsePhyla) {

        // Create a dictionary storing each taxon row
        const taxonDict: { [id: string]: PhylumPdRow } = {};

        // Iterate over each row
        this.rows.forEach(row => {

          // Check if the taxon ends with a suffix (_A, _B, etc.)
          const match = row.taxon.match(/_([A-Z])$/);
          let cur_taxon = row.taxon;
          if (match) {
            cur_taxon = row.taxon.slice(0, -2);
          }

          if (!taxonDict[cur_taxon]) {
            // If the taxon already exists then add the exact row
            taxonDict[cur_taxon] = {
              taxon: cur_taxon,
              scaled: row.scaled,
              unscaled: row.unscaled,
              abs: row.abs
            };
          } else {
            // If the taxon is already in the dictionary, add the values
            taxonDict[cur_taxon].scaled += row.scaled;
            taxonDict[cur_taxon].unscaled += row.unscaled;
            taxonDict[cur_taxon].abs += row.abs;
          }
        });

        // Round the values to 2 decimal places
        const out: PhylumPdRow[] = [];
        Object.values(taxonDict).forEach(row => {
          out.push({
            taxon: row.taxon,
            scaled: round(row.scaled, 2),
            unscaled: round(row.unscaled, 2),
            abs: round(row.abs, 2)
          });
        });
        return out;
      }

      // Otherwise, just return the rows
      else {
        return this.rows;
      }

    }
  },
  data() {
    return {
      headers: [
        {text: 'Phylum', value: 'taxon'},
        {text: 'Scaled (%)', value: 'scaled'},
        {text: 'Unscaled (%)', value: 'unscaled'},
        {text: 'Abs. difference', value: 'abs'}
      ],
      collapsePhyla: false
    }
  }
})
</script>

<style scoped>
</style>
