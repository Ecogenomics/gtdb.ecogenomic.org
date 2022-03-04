<template>
  <v-row align="center" class="py-1" no-gutters>

    <v-col class="pr-1 py-1" cols="12" sm="5">

      <!-- Column selection -->
      <v-autocomplete
        v-model="initialColumn"
        :items="columnsForSelect"
        background-color="white"
        clearable
        dense
        hide-details
        outlined
        @input="setColumn"
      ></v-autocomplete>
    </v-col>

    <!-- Operator selection (e.g. >, IS, IS NOT) -->
    <v-col class="pr-1 py-1" cols="12" sm="2">
      <v-select
        v-model="initialOperator"
        :items="operatorsForColumn"
        background-color="white"
        dense
        hide-details
        item-text="display"
        item-value="id"
        outlined
        @input="setOperator"
      ></v-select>
    </v-col>

    <!-- Value to enter -->
    <v-col class="pr-1 py-1" cols="12" sm="4">

      <!-- Enum data type -->
      <template v-if="columnIsEnumType">
        <v-select
          v-model="Number.parseInt(initialNodeRuleValue)"
          :items="curColumn.options"
          background-color="white"
          dense
          hide-details
          item-text="display"
          item-value="id"
          outlined
          @input="setSearchValue"
        ></v-select>
      </template>

      <!-- Date data type -->
      <template v-else-if="columnIsDateType">
        <v-row align="center" no-gutters>
          <!-- Date picker -->
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            hide-details
            min-width="auto"
            offset-y
            transition="scale-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <!-- Text area for the date picker -->
              <v-text-field
                v-model="initialNodeRuleValue"
                :rules="[validateDate]"
                background-color="white"
                class="ml-2"
                clearable
                dense
                hide-details
                label="YYYY-MM-DD"
                outlined
                @input="setSearchValue"
              >
                <template v-slot:prepend>
                  <!-- Button to launch the date picker -->
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    elevation="0"
                    fab
                    style="top: -2px;"
                    x-small
                  >
                    <v-icon dark>
                      {{ mdiCalendarCursorSvg }}
                    </v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </template>
            <v-date-picker
              hide-details
              no-title
              scrollable
              @input="setSearchValue($event); menu = false"
            >
            </v-date-picker>
          </v-menu>
        </v-row>
      </template>

      <!-- Boolean data type -->
      <template v-else-if="columnIsBoolType">
        <!-- Operator is used as value -->
      </template>


      <!-- Numeric data type -->
      <template v-else-if="columnIsNumericType">
        <v-text-field
          v-model="initialNodeRuleValue"
          :rules="[validateNumeric]"
          background-color="white"
          clearable
          dense
          hide-details
          outlined
          @input="setSearchValue"
        ></v-text-field>
      </template>

      <!-- String data type  -->
      <template v-else>
        <v-text-field
          v-model="initialNodeRuleValue"
          background-color="white"
          clearable
          dense
          hide-details
          outlined
          @input="setSearchValue"
        ></v-text-field>
      </template>
    </v-col>

    <v-col cols="12" sm="1">
      <div class="d-flex">
        <v-spacer></v-spacer>

        <!-- Remove rule button -->
        <v-tooltip open-delay="150" top transition="slide-x-transition">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" color="#424242" elevation="0" fab
                   x-small
                   @click="removeRule"
            >
              <v-icon color="#ffffff">
                {{  mdiFilterMinusSvg  }}
              </v-icon>
            </v-btn>
          </template>
          <span>Remove Rule</span>
        </v-tooltip>

      </div>

    </v-col>

  </v-row>

</template>

<script lang="ts">
import Vue, {PropType} from 'vue'

import {Column, ColumnDataType, getters, NodeRule, Operator} from "~/store/advanced";
import {mdiCalendarCursor, mdiFilterMinus} from "@mdi/js";

function sortText(a: string, b: string): number {
  return a > b ? 1 : a < b ? -1 : 0
}

function sortColumns(a: Column, b: Column): number {
  // Sort based on group (override)
  if (a.group == b.group) {
    return sortText(a.display, b.display)
  } else {
    if (a.group == 'General') {
      return 1
    } else if (a.group == 'Taxonomic Information') {
      return 1
    } else if (a.group == 'Genome Characteristics') {
      return 1
    } else if (a.group == 'NCBI Metadata') {
      return 1
    } else {
      return sortText(a.group, b.group)
    }
  }
}

export default Vue.extend({
  components: {},
  props: {
    depth: Number,
    node: Object as PropType<NodeRule>
  },
  name: "SearchRule",

  data: () => ({
    menu: false,
    date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    mdiCalendarCursorSvg: mdiCalendarCursor,
    mdiFilterMinusSvg: mdiFilterMinus,

  }),

  computed: {
    // Set the initial value of the column selection dropdown without mutating the prop
    initialColumn: {
      get: function () {
        return this.node.columnId
      },
      set: function () {
      }
    },

    // Set the initial value of the operator selection dropdown without mutating the prop
    initialOperator: {
      get: function () {
        return this.node.operatorId
      },
      set: function () {
      }
    },

    // Set the initial NodeRule value if its present, without mutating the prop
    initialNodeRuleValue: {
      get: function () {
        return this.node.value
      },
      set: function () {
      }
    },

    // True if the current column must select a value from an enum list
    columnIsEnumType() {
      const curColumn: Column | null = (this as any).curColumn
      if (curColumn != null) {
        return curColumn.dataType === ColumnDataType.ENUM
      }
      return false
    },
    columnIsDateType() {
      const curColumn: Column | null = (this as any).curColumn
      if (curColumn != null) {
        return curColumn.dataType === ColumnDataType.DATE
      }
      return false
    },
    columnIsBoolType() {
      const curColumn: Column | null = (this as any).curColumn
      if (curColumn != null) {
        return curColumn.dataType === ColumnDataType.BOOLEAN
      }
      return false
    },
    columnIsNumericType() {
      const curColumn: Column | null = (this as any).curColumn
      if (curColumn != null) {
        return curColumn.dataType === ColumnDataType.NUMERIC
      }
      return false
    },

    // The current this node has selected
    curColumn() {
      if (this.node.columnId != null) {
        return (this as any).allColumns[this.node.columnId]
      } else {
        return null;
      }
    },

    allColumns(): ReturnType<typeof getters.columns> {
      return this.$accessor.advanced.columns as ReturnType<typeof getters.columns>
    },
    allOperators() {
      return this.$accessor.advanced.operators;
    },
    columnsForSelect() {
      const out: object[] = [];
      const allColumns: Column[] = Object.values(this.$accessor.advanced.columns);
      let curCol = '';
      for (const col of allColumns.sort(sortColumns)) {

        // Set the column group
        if (curCol != col.group) {
          out.push({"header": col.group})
          curCol = col.group;
        }

        // Add the value
        out.push({
          "text": col.display,
          "value": col.id,
        })
      }
      return out;
    },

    // Return only those operators which match the column data type
    operatorsForColumn(): Operator[] {
      const curColumn: Column | null = (this as any).curColumn;
      if (curColumn == null) {
        return []
      }
      const allOps: ReturnType<typeof getters.operators> = (this as any).allOperators;
      const out = [];
      for (const op of Object.values(allOps)) {
        if (op.dataType === curColumn.dataType) {
          out.push(op);
        }
      }
      return out;
    },
  },

  methods: {
    // When the column select box changes
    setColumn(val: string) {
      this.$accessor.advanced.setNodeRuleColumn({
        "node": this.node,
        "columnId": val
      })
    },

    // When the operator select box changes
    setOperator(val: string) {
      this.$accessor.advanced.setNodeRuleOperator({
        "node": this.node,
        "operatorId": val
      })
    },

    // When the value of the search changes
    setSearchValue(val: string) {
      this.$accessor.advanced.setNodeRuleSearchValue({
        "node": this.node,
        "value": val
      })
    },

    // Remove this node from the search tree
    removeRule() {
      this.$accessor.advanced.removeNode(this.node);
    },

    // Validate the date is YYYY-MM-DD format
    validateDate(val: string | null) {
      return !(val != null && !val.match(/^\d{4}-\d{1,2}-\d{1,2}$/));
    },

    validateNumeric(val: any | null) {
      return val == null ? true : !isNaN(val)
    }
  }
})
</script>

<style scoped>

</style>
