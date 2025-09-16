<template>
  <v-dialog
      v-model="showDialog"
      max-width="1000"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
          :disabled="disabled"
          class="white--text ml-2"
          color="#5a6855"
          depressed
          v-bind="attrs"
          @click="showDialog = true"
          v-on="on"
      >
        <v-icon left>
          {{ paramIconSvg }}
        </v-icon>
        Parameters
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5 white--text" style="background-color: #5a6855">
        <v-icon dark left>
          {{ paramIconSvg }}
        </v-icon>
        Parameters
      </v-card-title>

      <v-card-text class="mt-5 text--primary">
        <!-- Preamble -->
        <p>
          <b>skani</b> parameters are pre-filled with the default values for the specific release.
          For more information, consult the
          <a href="https://doi.org/10.1038/s41592-023-02018-3" target="_blank">manuscript</a>
          or the <a href="https://github.com/bluenote-1577/skani" target="_blank">documentation</a>.
        </p>

        <!-- Code block -->
        <SkaniCodeBlock
            v-model="payload"
            :mode="mode"
            :program="version"
        />

        <!-- Parameters -->
        <v-card class="mt-3" outlined>
          <v-card-title class="paramSectionTitle">
            Preset
          </v-card-title>
          <v-card-text>
            <v-chip-group
                v-model="valSkaniPreset"
                column
            >

              <v-tooltip bottom max-width="800px">
                <template v-slot:activator="{ on, attrs }">
                  <v-chip :value="SkaniPresetEnum.FAST" filter outlined v-bind="attrs" v-on="on">
                    Fast
                  </v-chip>
                </template>
                <span>Faster skani mode; 2x faster and less memory. Less accurate AF and less accurate ANI for distant genomes, but works ok for high N50 and > 95% ANI. Alias for -c 200.</span>
              </v-tooltip>

              <v-tooltip bottom max-width="800px">
                <template v-slot:activator="{ on, attrs }">
                  <v-chip :value="SkaniPresetEnum.MEDIUM" filter outlined v-bind="attrs" v-on="on">
                    Medium
                  </v-chip>
                </template>
                <span>Medium skani mode; 2x slower and more memory. More accurate AF and more accurate ANI for moderately fragmented assemblies (< 10kb N50). Alias for -c 70.</span>
              </v-tooltip>

              <v-tooltip bottom max-width="800px">
                <template v-slot:activator="{ on, attrs }">
                  <v-chip :value="SkaniPresetEnum.SLOW" filter outlined v-bind="attrs" v-on="on">
                    Slow
                  </v-chip>
                </template>
                <span>
                Slower skani mode; 4x slower and more memory. Gives much more accurate AF
                           for distant genomes. More accurate ANI for VERY fragmented assemblies (<
                           3kb N50), but less accurate ANI otherwise. Alias for -c 30.
              </span>
              </v-tooltip>


              <v-tooltip bottom max-width="800px">
                <template v-slot:activator="{ on, attrs }">
                  <v-chip :value="SkaniPresetEnum.SMALL_GENOMES" filter outlined v-bind="attrs" v-on="on">
                    Small genomes
                  </v-chip>
                </template>
                <span>
                Mode for small genomes such as viruses or plasmids (< 20 kb). Can be much
                           faster for large data, but is slower/less accurate on bacterial-sized
                           genomes. Alias for: -c 30 -m 200 --faster-small
              </span>
              </v-tooltip>
            </v-chip-group>
          </v-card-text>
        </v-card>


        <v-card class="mt-3" outlined>
          <v-card-title class="paramSectionTitle">
            Output
          </v-card-title>
          <v-card-text>

            <v-row no-gutters>
              <v-col class="pr-2">
                <v-tooltip bottom max-width="800px">
                  <template v-slot:activator="{ on, attrs }">
                    <!-- f64 -->
                    <v-text-field
                        v-model="valSkaniMinAf"
                        dense
                        hide-details
                        label="Minimum Alignment Fraction"
                        outlined
                        persistent-placeholder
                        placeholder="15"
                        type="number"
                        v-bind="attrs"
                        v-on="on"
                    ></v-text-field>
                  </template>
                  <span>Only output ANI values where one genome has aligned fraction > than this value. [default: 15]</span>
                </v-tooltip>
              </v-col>

              <v-col class="pl-2">
                <v-tooltip bottom max-width="800px">
                  <template v-slot:activator="{ on, attrs }">
                    <!-- f64 -->
                    <v-text-field
                        v-model="valSkaniBothMinAf"
                        clearable
                        dense
                        hide-details
                        label="Both minimum alignment fraction"
                        outlined
                        type="number"
                        v-bind="attrs"
                        v-on="on"
                    ></v-text-field>
                  </template>
                  <span>Only output ANI values where both genomes have aligned fraction > than this value. [default: disabled]</span>
                </v-tooltip>
              </v-col>

            </v-row>

          </v-card-text>
        </v-card>


        <v-card class="mt-3" outlined>
          <v-card-title class="paramSectionTitle">
            Algorithm Parameters
          </v-card-title>
          <v-card-text>

            <v-row no-gutters>

              <v-col class="pr-2">
                <v-tooltip bottom max-width="800px">
                  <!-- usize -->
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="valSkaniCFactor"
                        :disabled="skaniCFactorDisabled"
                        dense
                        hide-details
                        label="Compression factor (k-mer subsampling rate)"
                        outlined
                        persistent-placeholder
                        placeholder="125"
                        type="number"
                        v-bind="attrs"
                        v-on="on"
                    ></v-text-field>
                  </template>
                  <span>Compression factor (k-mer subsampling rate). [default: 125]</span>
                </v-tooltip>
              </v-col>

              <v-col class="px-2">
                <v-tooltip bottom max-width="800px">
                  <!-- usize -->
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="valSkaniMFactor"
                        :disabled="skaniMFactorDisabled"
                        dense
                        hide-details
                        label="Marker k-mer compression factor"
                        outlined
                        persistent-placeholder
                        placeholder="1000"
                        type="number"
                        v-bind="attrs"
                        v-on="on"
                    ></v-text-field>
                  </template>
                  <span>Marker k-mer compression factor. Markers are used for filtering.
                             Consider decreasing to ~200-300 if working with small genomes (e.g.
                             plasmids or viruses). [default: 1000]</span>
                </v-tooltip>
              </v-col>

              <v-col class="pl-2">
                <v-tooltip bottom max-width="800px">
                  <!-- f64 -->
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="valSkaniScreen"
                        dense
                        hide-details
                        label="Screen < % identity"
                        outlined
                        persistent-placeholder
                        placeholder="80"
                        type="number"
                        v-bind="attrs"
                        v-on="on"
                    ></v-text-field>
                  </template>
                  <span>Screen out pairs with *approximately* < % identity using k-mer
                             sketching. [default: 80]</span>
                </v-tooltip>
              </v-col>

            </v-row>

            <v-row class="mt-3" no-gutters>
              <v-col>
                <v-tooltip bottom max-width="800px">
                  <!-- bool -->
                  <template v-slot:activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on">
                      <v-checkbox
                          v-model="valSkaniFasterSmall"
                          :disabled="skaniFasterSmallDisabled"
                          color="#5a6855"
                          dense
                          hide-details
                          label="Use faster small"
                      ></v-checkbox>
                    </div>
                  </template>
                  <span>Filter genomes with < 20 marker k-mers more aggressively. Much faster for many small genomes but may miss some comparisons.</span>
                </v-tooltip>
              </v-col>
              <v-col>
                <v-tooltip bottom max-width="800px">
                  <!-- bool -->
                  <template v-slot:activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on">
                      <v-checkbox
                          v-model="valSkaniUseMedian"
                          color="#5a6855"
                          dense
                          hide-details
                          label="Use median"
                      ></v-checkbox>
                    </div>
                  </template>
                  <span>Estimate median identity instead of average (mean) identity.</span>
                </v-tooltip>
              </v-col>
              <v-col>
                <v-tooltip bottom max-width="800px">
                  <!-- bool -->
                  <template v-slot:activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on">
                      <v-checkbox
                          v-model="valSkaniNoLearnedAni"
                          color="#5a6855"
                          dense
                          hide-details
                          label="No learned ANI"
                      ></v-checkbox>
                    </div>
                  </template>
                  <span>Disable regression model for ANI prediction. [default: learned ANI used
                             for c >= 70 and >= 150,000 bases aligned and not on individual contigs.</span>
                </v-tooltip>
              </v-col>
              <v-col v-if="showNoMarkerIndex">
                <v-tooltip bottom max-width="800px">
                  <!-- bool -->
                  <template v-slot:activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on">
                      <v-checkbox
                          v-model="valSkaniNoMarkerIndex"
                          color="#5a6855"
                          dense
                          hide-details
                          label="No marker index"
                      ></v-checkbox>
                    </div>
                  </template>
                  <span>Do not use hash-table inverted index for faster ANI filtering.
                             [default: load index if > 100 query files or using the --qi option].</span>
                </v-tooltip>
              </v-col>
              <v-col>
                <v-tooltip bottom max-width="800px">
                  <!-- bool -->
                  <template v-slot:activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on">
                      <v-checkbox
                          v-model="valSkaniRobust"
                          color="#5a6855"
                          dense
                          hide-details
                          label="Robust"
                      ></v-checkbox>
                    </div>
                  </template>
                  <span>Estimate mean after trimming off 10%/90% quantiles.</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>


      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="primary"
            text
            @click="saveParameters"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue, {PropType} from "vue";
import {mdiCog} from "@mdi/js";
import {maybeUseFloat, maybeUseInt} from "~/assets/ts/common";
import {SkaniCalculationMode, SkaniParameters, SkaniParametersPreset, SkaniVersion} from "~/assets/api/skani";


export default Vue.extend({
  components: {},

  props: {
    version: String as PropType<SkaniVersion>,
    disabled: Boolean,
    value: Object as PropType<SkaniParameters>,
    mode: String as PropType<SkaniCalculationMode>,
  },

  watch: {
    value(after, before) {
      this.initVarsFromProps();
    },

    valSkaniPreset(after, before) {
      console.log(after, before);
      if (before === SkaniParametersPreset.SMALL_GENOMES) {
        this.valSkaniMFactor = null;
        this.skaniMFactorDisabled = false;
        this.valSkaniFasterSmall = null;
        this.skaniFasterSmallDisabled = false;
      }

      if (after === SkaniParametersPreset.FAST) {
        this.valSkaniCFactor = 200;
        this.skaniCFactorDisabled = true;
      } else if (after === SkaniParametersPreset.MEDIUM) {
        this.valSkaniCFactor = 70;
        this.skaniCFactorDisabled = true;
      } else if (after === SkaniParametersPreset.SLOW) {
        this.valSkaniCFactor = 30;
        this.skaniCFactorDisabled = true;
      } else if (after === SkaniParametersPreset.SMALL_GENOMES) {
        this.valSkaniCFactor = 30;
        this.skaniCFactorDisabled = true;
        this.valSkaniMFactor = 200;
        this.skaniMFactorDisabled = true;
        this.valSkaniFasterSmall = true;
        this.skaniFasterSmallDisabled = true;
      } else {
        this.valSkaniCFactor = null;
        this.skaniCFactorDisabled = false;
      }
    }
  },

  computed: {
    SkaniPresetEnum() {
      return SkaniParametersPreset
    },

    showNoMarkerIndex() {
      return this.mode !== SkaniCalculationMode.TRIANGLE;
    },


    payload(): SkaniParameters {
      return {
        minAf: maybeUseFloat(this.valSkaniMinAf),
        bothMinAf: maybeUseFloat(this.valSkaniBothMinAf),
        skaniPreset: this.valSkaniPreset != null ? this.valSkaniPreset : null,
        cFactor: maybeUseInt(this.valSkaniCFactor),
        fasterSmall: this.valSkaniFasterSmall,
        mFactor: maybeUseInt(this.valSkaniMFactor),
        useMedian: this.valSkaniUseMedian,
        noLearnedAni: this.valSkaniNoLearnedAni,
        noMarkerIndex: this.valSkaniNoMarkerIndex,
        robust: this.valSkaniRobust,
        screen: maybeUseFloat(this.valSkaniScreen)
      }
    }
  },

  data: () => ({
    paramIconSvg: mdiCog,

    showDialog: false,

    valSkaniMinAf: null as null | number,
    valSkaniBothMinAf: null as null | number,
    valSkaniPreset: null as null | SkaniParametersPreset,
    valSkaniCFactor: null as null | number,
    valSkaniFasterSmall: null as null | boolean,
    valSkaniMFactor: null as null | number,
    valSkaniUseMedian: null as null | boolean,
    valSkaniNoLearnedAni: null as null | boolean,
    valSkaniNoMarkerIndex: null as null | boolean,
    valSkaniRobust: null as null | boolean,
    valSkaniScreen: null as null | number,

    skaniCFactorDisabled: false,
    skaniFasterSmallDisabled: false,
    skaniMFactorDisabled: false,
  }),

  mounted() {
    this.initVarsFromProps();
  },


  methods: {

    saveParameters() {
      this.$emit("input", this.payload);
      this.showDialog = false;
    },

    initVarsFromProps(): void {
      // Copy the parent values into a temporary variable so we don't mutate them
      if (this.value != null) {
        this.valSkaniMinAf = this.value.minAf
        this.valSkaniBothMinAf = this.value.bothMinAf
        this.valSkaniPreset = this.value.skaniPreset
        this.valSkaniCFactor = this.value.cFactor
        this.valSkaniFasterSmall = this.value.fasterSmall
        this.valSkaniMFactor = this.value.mFactor
        this.valSkaniUseMedian = this.value.useMedian
        this.valSkaniNoLearnedAni = this.value.noLearnedAni
        this.valSkaniNoMarkerIndex = this.value.noMarkerIndex
        this.valSkaniRobust = this.value.robust
        this.valSkaniScreen = this.value.screen
      } else {
        this.valSkaniMinAf = null
        this.valSkaniBothMinAf = null
        this.valSkaniPreset = null
        this.valSkaniCFactor = null
        this.valSkaniFasterSmall = null
        this.valSkaniMFactor = null
        this.valSkaniUseMedian = null
        this.valSkaniNoLearnedAni = null
        this.valSkaniNoMarkerIndex = null
        this.valSkaniRobust = null
        this.valSkaniScreen = null
      }
    }

  },

})
</script>

<style scoped>

</style>
