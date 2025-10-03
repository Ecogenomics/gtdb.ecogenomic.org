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
    <AniCodeBlockSkani
      :program="program"
      v-model="payload"
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

          <v-col class="pl-2">
            <v-tooltip bottom max-width="800px">
              <!-- bool -->
              <template v-slot:activator="{ on, attrs }">
                <div v-bind="attrs" v-on="on">
                  <v-checkbox
                    v-model="valSkaniDetailed"
                    color="#5a6855"
                    dense
                    hide-details
                    label="Detailed"
                  ></v-checkbox>
                </div>
              </template>
              <span>Print additional info including contig N50s and more.</span>
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

        <v-row no-gutters class="mt-3">
          <v-col>
            <v-tooltip bottom max-width="800px">
              <!-- bool -->
              <template v-slot:activator="{ on, attrs }">
                <div v-bind="attrs" v-on="on">
                  <v-checkbox
                    v-model="valSkaniFasterSmall"
                    :disabled="skaniFasterSmallDisabled"
                    color="#5a6855"
                    label="Use faster small"
                    dense
                    hide-details
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
                    label="Use median"
                    dense
                    hide-details
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
                    label="No learned ANI"
                    dense
                    hide-details
                  ></v-checkbox>
                </div>
              </template>
              <span>Disable regression model for ANI prediction. [default: learned ANI used
                             for c >= 70 and >= 150,000 bases aligned and not on individual contigs.</span>
            </v-tooltip>
          </v-col>
          <v-col>
            <v-tooltip bottom max-width="800px">
              <!-- bool -->
              <template v-slot:activator="{ on, attrs }">
                <div v-bind="attrs" v-on="on">
                  <v-checkbox
                    v-model="valSkaniNoMarkerIndex"
                    color="#5a6855"
                    label="No marker index"
                    dense
                    hide-details
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
                    label="Robust"
                    dense
                    hide-details
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
import {AniParametersSkaniJson, SkaniParametersPresetEnum} from "~/assets/api/ani";
import {isDefined, maybeUseFloat, maybeUseInt} from "~/assets/ts/common";


export default Vue.extend({
  components: {},

  // Not currently used but may be relevant when there are additional versions of skani.
  props: {
    program: {
      type: String
    },

    disabled: Boolean,

    value: Object as PropType<AniParametersSkaniJson>
  },

  watch: {
    valSkaniPreset(after, before) {
      console.log(after, before);
      if (before === SkaniParametersPresetEnum.SMALL_GENOMES) {
        this.valSkaniMFactor = null;
        this.skaniMFactorDisabled = false;
        this.valSkaniFasterSmall = null;
        this.skaniFasterSmallDisabled = false;
      }

      if (after === SkaniParametersPresetEnum.FAST) {
        this.valSkaniCFactor = 200;
        this.skaniCFactorDisabled = true;
      } else if (after === SkaniParametersPresetEnum.MEDIUM) {
        this.valSkaniCFactor = 70;
        this.skaniCFactorDisabled = true;
      } else if (after === SkaniParametersPresetEnum.SLOW) {
        this.valSkaniCFactor = 30;
        this.skaniCFactorDisabled = true;
      } else if (after === SkaniParametersPresetEnum.SMALL_GENOMES) {
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
      return SkaniParametersPresetEnum
    },

    payload(): AniParametersSkaniJson {
      return {
        skaniMinAf: maybeUseFloat(this.valSkaniMinAf),
        skaniBothMinAf: maybeUseFloat(this.valSkaniBothMinAf),
        skaniPreset: this.valSkaniPreset,
        skaniCFactor: maybeUseInt(this.valSkaniCFactor),
        skaniFasterSmall: this.valSkaniFasterSmall,
        skaniMFactor: maybeUseInt(this.valSkaniMFactor),
        skaniUseMedian: this.valSkaniUseMedian,
        skaniNoLearnedAni: this.valSkaniNoLearnedAni,
        skaniNoMarkerIndex: this.valSkaniNoMarkerIndex,
        skaniRobust: this.valSkaniRobust,
        skaniScreen: maybeUseFloat(this.valSkaniScreen),
        skaniDetailed: this.valSkaniDetailed,
      }
    }
  },

  data: () => ({
    paramIconSvg: mdiCog,

    showDialog: false,

    valSkaniMinAf: null as null | number,
    valSkaniBothMinAf: null as null | number,
    valSkaniPreset: null as null | SkaniParametersPresetEnum,
    valSkaniCFactor: null as null | number,
    valSkaniFasterSmall: null as null | boolean,
    valSkaniMFactor: null as null | number,
    valSkaniUseMedian: null as null | boolean,
    valSkaniNoLearnedAni: null as null | boolean,
    valSkaniNoMarkerIndex: null as null | boolean,
    valSkaniRobust: null as null | boolean,
    valSkaniScreen: null as null | number,
    valSkaniDetailed: null as null | boolean,

    skaniCFactorDisabled: false,
    skaniFasterSmallDisabled: false,
    skaniMFactorDisabled: false,
  }),

  mounted() {
    // Copy the parent values into a temporary variable so we don't mutate them
    if (isDefined(this.value)) {
      this.valSkaniMinAf = this.value.skaniMinAf
      this.valSkaniBothMinAf = this.value.skaniBothMinAf
      this.valSkaniPreset = this.value.skaniPreset
      this.valSkaniCFactor = this.value.skaniCFactor
      this.valSkaniFasterSmall = this.value.skaniFasterSmall
      this.valSkaniMFactor = this.value.skaniMFactor
      this.valSkaniUseMedian = this.value.skaniUseMedian
      this.valSkaniNoLearnedAni = this.value.skaniNoLearnedAni
      this.valSkaniNoMarkerIndex = this.value.skaniNoMarkerIndex
      this.valSkaniRobust = this.value.skaniRobust
      this.valSkaniScreen = this.value.skaniScreen
      this.valSkaniDetailed = this.value.skaniDetailed
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
      this.valSkaniDetailed = null
    }
  },


  methods: {

    saveParameters() {
      this.$emit("input", this.payload);
      this.showDialog = false;
    }

  },

})
</script>

<style scoped>

</style>
