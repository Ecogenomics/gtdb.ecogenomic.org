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

        <p>
          <b>FastANI</b> parameters are pre-filled with the default values for the specific release.
          For more information, consult the
          <a href="https://doi.org/10.1038/s41592-023-02018-3" target="_blank">manuscript</a>
          or the <a href="https://github.com/bluenote-1577/skani" target="_blank">documentation</a>.
        </p>

        <!-- Code block -->
        <AniCodeBlockFastAni
          v-model="payload"
          :program="program"
        />

        <!-- Parameters -->
        <v-row no-gutters>
          <v-col>
            <v-tooltip bottom max-width="800px">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="fastAniFragLen"
                  dense
                  hide-details
                  hint="fragment length [default : 3,000]"
                  label="Fragment length"
                  outlined
                  persistent-placeholder
                  placeholder="3000"
                  type="number"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <span>fragment length [default : 3,000]</span>
            </v-tooltip>
          </v-col>
          <v-col class="px-3">
            <v-tooltip bottom max-width="800px">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="fastAniKmer"
                  dense
                  hide-details
                  hint="k-mer size <= 16 [default 16]"
                  label="k-mer size"
                  outlined
                  persistent-placeholder
                  placeholder="16"
                  type="number"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <span>kmer size <= 16 [default : 16]</span>
            </v-tooltip>
          </v-col>
          <v-col v-if="isFastAniMinFragVersion">
            <v-tooltip bottom max-width="800px">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="fastAniMinFrag"
                  dense
                  hide-details
                  hint="minimum fragments for trusting ANI [default : 50]"
                  label="Minimum aligned fragments"
                  outlined
                  persistent-placeholder
                  placeholder="50"
                  type="number"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <span>minimum fragments for trusting ANI [default : 50]</span>
            </v-tooltip>
          </v-col>
          <v-col v-else>

            <v-tooltip bottom max-width="800px">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="fastAniMinFrac"
                  dense
                  hide-details
                  hint="minimum fraction of genome that must be shared for trusting ANI [default: 0.2]"
                  label="Minimum alignment fraction"
                  outlined
                  persistent-placeholder
                  placeholder="0.2"
                  type="number"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <span>
                  minimum fraction of genome that must be shared for trusting ANI. If reference and query genome size differ, smaller one among the two is considered. [default : 0.2]
                </span>
            </v-tooltip>
          </v-col>
        </v-row>

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
import {AniParametersFastAniJson, AniProgramEnum, convertAniProgramStringToEnum} from "~/assets/api/ani";
import {isDefined, maybeUseFloat, maybeUseInt} from "~/assets/ts/common";

export default Vue.extend({
  components: {},

  props: {
    program: {
      type: String
    },

    disabled: Boolean,
    value: Object as PropType<AniParametersFastAniJson>,
  },

  computed: {

    payload(): AniParametersFastAniJson {
      return {
        fastAniKmer: maybeUseInt(this.fastAniKmer),
        fastAniFragLen: maybeUseInt(this.fastAniFragLen),
        fastAniMinFrag: maybeUseInt(this.fastAniMinFrag),
        fastAniMinFrac: maybeUseFloat(this.fastAniMinFrac),
      }
    },

    isFastAniMinFragVersion(): boolean {
      if (isDefined(this.program)) {
        const programEnum = convertAniProgramStringToEnum(this.program);
        if (isDefined(programEnum)) {
          //@ts-ignore
          return [AniProgramEnum.FASTANI_1_0, AniProgramEnum.FASTANI_1_1, AniProgramEnum.FASTANI_1_2].includes(programEnum);
        }
      }
      return false;
    },

  },

  data: () => ({
    showDialog: false,

    paramIconSvg: mdiCog,

    fastAniKmer: null as null | number,
    fastAniFragLen: null as null | number,
    fastAniMinFrag: null as null | number,
    fastAniMinFrac: null as null | number,
  }),


  methods: {

    saveParameters() {
      this.$emit("input", this.payload);
      this.showDialog = false;
    },


  },

  mounted() {
    if (isDefined(this.value)) {
      this.fastAniKmer = this.value.fastAniKmer;
      this.fastAniFragLen = this.value.fastAniFragLen;
      this.fastAniMinFrag = this.value.fastAniMinFrag;
      this.fastAniMinFrac = this.value.fastAniMinFrac;
    } else {
      this.fastAniKmer = null;
      this.fastAniFragLen = null;
      this.fastAniMinFrag = null;
      this.fastAniMinFrac = null;
    }

  }
})
</script>

<style scoped>

</style>
