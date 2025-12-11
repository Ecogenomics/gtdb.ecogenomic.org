<template>
  <div class="w-100">
    <div :style="{background: gradientBg}" class="gradient-class rounded"></div>
    <v-row class="mt-2" no-gutters>
      <v-col>
        <v-color-picker
          v-model="currentHex"
          width="300"
          @update:color="updateColorForIndex"
        ></v-color-picker>
      </v-col>
      <v-col cols="auto">
        <v-row
          v-for="(item, index) in formValues"
          :key="index"
          class="pt-1"
          no-gutters
        >
          <v-btn
            :class="{activeButton: index === activeIndex, colorButton: true}"
            :color="item.hex"
            depressed
            height="40"
            max-width="40"
            min-width="40"
            width="40"
            @click="setActiveIndex(index)"
          ></v-btn>
          <v-text-field
            v-model="item.hex"
            class="ml-1"
            dense
            hide-details
            outlined
            style="width: 100px;"
            @change="val => updateHexAtIndex(index, val)"
          ></v-text-field>
          <v-text-field
            v-model="item.stop"
            class="ml-1"
            dense
            hide-details
            outlined
            style="width: 100px;"
            @change="val => updateStopAtIndex(index, val)"
          ></v-text-field>
          <v-btn
            :disabled="formValues.length === 1"
            class="ml-1"
            depressed
            height="40"
            max-width="40"
            min-width="40"
            small
            width="40"
            @click="removeValueAtIndex(index)"
          >
            <v-icon>
              {{ mdiDeleteSvg }}
            </v-icon>
          </v-btn>
          <v-btn
            class="ml-1"
            depressed
            height="40"
            max-width="40"
            min-width="40"
            small
            width="40"
            @click="addNewStopAtIndex(index)"
          >
            <v-icon>
              {{ mdiPlusSvg }}
            </v-icon>
          </v-btn>
        </v-row>

      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {COLOURS, isNumeric} from "~/assets/ts/common";
import {mdiDelete, mdiPlus} from "@mdi/js";
import {DEFAULT_SKANI_COLOUR_SCALE} from "~/assets/ts/skani";


export default Vue.extend({

  computed: {
    gradientBg(): string {
      let style = 'linear-gradient(to right';
      for (let i = 0; i < this.activeValues.length; i++) {
        style += `, ${this.activeValues[i].hex} ${this.activeValues[i].stop}%`;
      }
      style += ')';
      return style;
    },
  },

  // Whenever the activeValues is updated, emit the new values to the parent
  watch: {
    activeValues: {
      handler(newValues) {
        this.$emit('input', newValues);
      },
      deep: true,
    },
  },

  data: () => ({
    // Icons
    mdiPlusSvg: mdiPlus,
    mdiDeleteSvg: mdiDelete,


    // Form data
    formValues: DEFAULT_SKANI_COLOUR_SCALE.map(v => ({...v})), // Deep copy
    activeValues: DEFAULT_SKANI_COLOUR_SCALE.map(v => ({...v})), // Deep copy
    activeIndex: 0,
    currentHex: DEFAULT_SKANI_COLOUR_SCALE[0].hex,
    nextColourIndex: 0,
  }),
  methods: {
    // Helper methods
    setHex(index: number, hex: string) {
      this.formValues[index].hex = hex;
      this.activeValues[index].hex = hex;
    },
    setStop(index: number, stop: number) {
      this.formValues[index].stop = stop;
      this.activeValues[index].stop = stop;
    },
    addValueAtIndex(index: number, stop: number, hex: string) {
      this.formValues.splice(index, 0, {stop: stop, hex: hex});
      this.activeValues.splice(index, 0, {stop: stop, hex: hex});
    },
    removeAtIndex(index: number) {
      if (index < 0 || index >= this.activeValues.length || this.activeValues.length === 1) {
        return;
      }
      this.formValues.splice(index, 1);
      this.activeValues.splice(index, 1);
    },
    // Re-order the values to ensure that the stop values are ascending
    reOrderValues() {
      this.formValues.sort((a, b) => a.stop - b.stop);
      this.activeValues.sort((a, b) => a.stop - b.stop);
    },
    getNewHexColour(): string {
      const colour = COLOURS[this.nextColourIndex % COLOURS.length].toUpperCase();
      this.nextColourIndex++;
      return colour;
    },
    updateColorForIndex() {
      this.setHex(this.activeIndex, this.currentHex);
    },
    // When the user selects a colour to edit
    setActiveIndex(index: number) {
      this.activeIndex = index;
      this.currentHex = this.activeValues[index].hex;
    },
    // When the user removes a stop
    removeValueAtIndex(index: number) {
      this.removeAtIndex(index);
      // Swap the index if needed
      if (this.activeIndex >= this.formValues.length) {
        this.activeIndex = this.formValues.length - 1;
      }
    },

    // When the user enters a new hex value into the textarea
    updateHexAtIndex(index: number, newValue: string) {
      const hexRegex = /^#([0-9A-Fa-f]{6})$/
      if (!hexRegex.test(newValue)) {
        // revert
        this.formValues[index].hex = this.activeValues[index].hex;
        return;
      }
      this.setHex(index, newValue);
    },
    // Searches all active values to find the closest stop to the given value
    getClosestStopIndex(value: number): number {
      let closestIndex = 0;
      let closestDiff = Math.abs(this.activeValues[0].stop - value);
      for (let i = 1; i < this.activeValues.length; i++) {
        const diff = Math.abs(this.activeValues[i].stop - value);
        if (diff < closestDiff) {
          closestDiff = diff;
          closestIndex = i;
        }
      }
      return closestIndex;
    },
    // When the user enters a new stop value into the textarea
    updateStopAtIndex(index: number, newValue: string) {
      if (!isNumeric(newValue)) {
        this.formValues[index].stop = this.activeValues[index].stop;
        return;
      }
      let parsedValue = parseFloat(newValue);
      if (parsedValue < 0 || parsedValue > 100) {
        // revert
        this.formValues[index].stop = this.activeValues[index].stop;
        return;
      }
      // Ensure the stop is unique
      const closestStopIndex = this.getClosestStopIndex(parsedValue);
      if (this.activeValues[closestStopIndex].stop === parsedValue) {
        // This is a non-unique stop value, we must select a new value for it

        if (this.activeValues.length < 2) {
          // If there is a single element in the array, then just pick a max or min
          if (parsedValue === 0) {
            parsedValue = 100;
          } else {
            parsedValue = 0;
          }
        } else {
          // Otherwise we can pick a value between the closest two stops
          if (closestStopIndex > 0) {
            parsedValue = (this.activeValues[closestStopIndex - 1].stop + parsedValue) / 2;
          } else if (closestStopIndex < this.activeValues.length - 1) {
            parsedValue = (this.activeValues[closestStopIndex + 1].stop + parsedValue) / 2;
          }
        }
      }

      // Set the values
      this.setStop(index, parsedValue);
      this.reOrderValues();
    },

    // When the user requests for a stop to be added after the current index location
    addNewStopAtIndex(index: number) {

      // Exit early if there is a single item in the array
      if (this.activeValues.length === 1) {
        // If there is a single element in the array, then just add 0 or 100 depending on what exists
        if (this.activeValues[0].stop === 0) {
          this.addValueAtIndex(index, 100, this.getNewHexColour());
        } else {
          this.addValueAtIndex(0, 0, this.getNewHexColour());
        }
        this.reOrderValues();
        return;
      }

      // Do not exceed the maximum value of 100
      if (index === this.activeValues.length - 1) {
        // if the maximum value is 100, then just add it before
        if (this.activeValues[index].stop === 100) {
          const midStop = (this.activeValues[index].stop + this.activeValues[index - 1].stop) / 2;
          this.addValueAtIndex(index, midStop, this.getNewHexColour());
        } else {
          this.addValueAtIndex(index + 1, 100, this.getNewHexColour());
        }
        this.reOrderValues();
        return;
      }

      // Otherwise we can pick a value between the closest two stops
      const midStop = (this.activeValues[index].stop + this.activeValues[index + 1].stop) / 2;
      this.addValueAtIndex(index + 1, midStop, this.getNewHexColour());
      this.reOrderValues();
    },
  },
})
</script>

<style scoped>
.gradient-class {
  height: 20px;
  width: 100%;
  border: 1px solid #1a1a1a;
}

.colorButton {
  outline: 1px solid #1a1a1a !important;
}

.activeButton {
  border: 2px solid white !important;
}

</style>
