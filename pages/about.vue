<template>
  <v-container class="gtdb-container">

    <v-card>

      <v-card-title class="text-h4">
        About

        <v-spacer></v-spacer>

        <div>
          <div v-if="apiVersion && apiVersion.length > 0" class="text-caption d-block version-link-out">
            <a href="https://github.com/Ecogenomics/api.gtdb.ecogenomic.org" target="_blank">
              <v-icon small>
                {{ mdiApiSvg }}
              </v-icon>
              {{ apiVersion }}
            </a>
          </div>

          <div v-if="nuxtVersion && nuxtVersion.length > 0" class="text-caption d-block version-link-out">
            <a href="https://github.com/Ecogenomics/gtdb.ecogenomic.org" target="_blank">
              <v-icon small>
                {{ mdiWebSvg }}
              </v-icon>
              {{ nuxtVersion }}
            </a>
          </div>
        </div>


      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="text--primary">

        <p>
          The Genome Taxonomy Database (GTDB) is an initiative to establish a standardised microbial taxonomy
          based on genome phylogeny, primarily funded by the <a href="https://www.arc.gov.au/" target="_blank">Australian
          Research Council</a> via a
          <a href="https://www.uq.edu.au/news/article/2015/06/uq-leads-nation-prestigious-arc-laureate-fellowships"
             target="_blank">Laureate Fellowship</a>
          (<a href="https://app.dimensions.ai/details/grant/grant.5129370" target="_blank">FL150100038</a>),
          a Future Fellowship (<a href="https://dataportal.arc.gov.au/NCGP/Web/Grant/Grant/FT170100213" target="_blank">FT170100213</a>), and
          Discovery Project
          (<a href="https://dataportal.arc.gov.au/NCGP/Web/Grant/Grant/DP220100900" target="_blank">DP220100900</a>),
          with the welcome assistance of <a
          href="https://research.uq.edu.au/research-support/research-management/funding-schemes/uq-internal-schemes"
          target="_blank">strategic funding from
          The University of Queensland.</a>
        </p>

        <p>
          The genomes used to construct the phylogeny are obtained from <a href="https://www.ncbi.nlm.nih.gov/refseq/"
                                                                           target="_blank">RefSeq</a>
          and <a href="https://www.ncbi.nlm.nih.gov/genbank/" target="_blank">GenBank</a>, and GTDB
          releases are indexed to RefSeq releases, starting with release 76. Importantly and increasingly,
          this dataset includes draft genomes of uncultured microorganisms obtained from metagenomes and single
          cells, ensuring improved genomic representation of the microbial world. All genomes are independently
          quality controlled using <a href="https://github.com/Ecogenomics/CheckM/wiki" target="_blank">CheckM</a>
          before inclusion in GTDB,
          see statistics
          <NuxtLink :to="latestStatsPageUrl">here</NuxtLink>
          .
        </p>

        <p>
          The GTDB taxonomy is based on genome trees inferred using <a
          href="http://www.microbesonline.org/fasttree/" target="_blank">FastTree</a> from an aligned concatenated set
          of
          120 single copy marker proteins for Bacteria, and with <a href="http://www.iqtree.org/">IQ-TREE</a> from a
          concatenated set of 53
          (starting with R07-RS207) and 122 (prior to R07-RS207) marker proteins for Archaea (download page
          <NuxtLink to="/downloads">here</NuxtLink>
          ).
          Additional marker sets are also used to cross-validate tree topologies including concatenated ribosomal
          proteins and ribosomal RNA genes.
        </p>

        <p>
          <a href="https://www.ncbi.nlm.nih.gov/taxonomy" target="_blank">NCBI taxonomy</a> was initially used to
          decorate the genome tree via
          <a href="http://tax2tree.sourceforge.net/" target="_blank">tax2tree</a> and subsequently used as a reference
          source of new taxonomic opinions including new names.
          The 16S rRNA-based <a href="http://greengenes.secondgenome.com" target="_blank">Greengenes</a> and <a
          href="https://www.arb-silva.de/" target="_blank">SILVA</a> taxonomies were intially used to supplement the
          taxonomy
          particularly in regions of the tree with no cultured representatives, however genome assembly
          identifiers are now used to create placeholder names for uncultured taxa.
        </p>

        <p>
          <a href="https://lpsn.dsmz.de/" target="_blank">LPSN</a> is used as the
          primary nomenclatural reference for establishing naming priorities and nomenclature types.
          All taxonomic ranks except species are normalised using <a href="https://github.com/dparks1134/PhyloRank"
                                                                     target="_blank">PhyloRank</a> and the taxonomy
          manually curated to
          remove polyphyletic groups.
          Polyphyly and rank evenness can be visualised in PhyloRank
          <NuxtLink :to="latestStatsPageUrl">plots</NuxtLink>
          .
          Species were originally delineated based on phylogeny and rank normalization but this was replaced with an
          ANI-based method (starting with R04-RS89)
          to enable scalable and automated assignment of genomes to species clusters.
        </p>

        <p>
          The GTDB taxonomy can be queried and downloaded through a number of tools on this website. Classification of
          new genomes based on GTDB framework can be done via
          <a href="https://github.com/Ecogenomics/GTDBTk" target="_blank">GTDB-Tk</a>.
        </p>


        <!-- The team -->
        <div class="d-block mt-10 ">
          <div class="d-block">
            <span class="text-h5">The Team</span>
            <p>
              The GTDB team is primarily based at the <a href="https://ecogenomic.org/" target="_blank">Australian
              Centre
              for Ecogenomics</a>, and comprises a curation and development group.
            </p>
          </div>

          <!-- Curation team -->
          <div class="d-inline-block mt-2 about-block pa-2 rounded">
            <div class="d-block">
              <span style="font-size: 16px; font-weight: 500;">Curation team</span>
            </div>

            <div class="d-block">
              <!-- Phil -->
              <AboutAvatar>
                <template v-slot:image>
                  <img alt="Phil Hugenholtz" src="~/assets/images/gtdb-team/phil.jpg">
                </template>
                <template v-slot:name>
                  <a href="https://ecogenomic.org/personnel/prof-phil-hugenholtz" target="_blank">Phil Hugenholtz</a>
                </template>
              </AboutAvatar>

              <!-- Maria -->
              <AboutAvatar>
                <template v-slot:image>
                  <img alt="Maria Chuvochina" src="~/assets/images/gtdb-team/maria.jpg">
                </template>
                <template v-slot:name>
                  <a href="https://ecogenomic.org/personnel/dr-maria-chuvochina" target="_blank">Maria Chuvochina</a>
                </template>
              </AboutAvatar>

              <!-- Chris -->
              <AboutAvatar>
                <template v-slot:image>
                  <img alt="Christian Rinke" src="~/assets/images/gtdb-team/chris.jpg">
                </template>
                <template v-slot:name>
                  <a href="https://ecogenomic.org/personnel/dr-christian-rinke" target="_blank">Christian Rinke</a>
                </template>
              </AboutAvatar>
            </div>
          </div>

          <!-- Dev team -->
          <div class="d-inline-block mt-2 about-block pa-2 mx-3 rounded">
            <div class="d-block">
              <span style="font-size: 16px; font-weight: 500;">Development team</span>
            </div>

            <div class="d-block">
              <!-- Donovan -->
              <AboutAvatar>
                <template v-slot:image>
                  <img alt="Donovan Parks" src="~/assets/images/gtdb-team/donovan.jpg">
                </template>
                <template v-slot:name>
                  <a href="https://ecogenomic.org/personnel/dr-donovan-parks" target="_blank">Donovan Parks</a>
                </template>
              </AboutAvatar>

              <!-- Pierre -->
              <AboutAvatar>
                <template v-slot:image>
                  <img alt="Pierre Chaumeil" src="~/assets/images/gtdb-team/pierre.jpg">
                </template>
                <template v-slot:name>
                  <a href="https://ecogenomic.org/personnel/mr-pierre-chaumeil" target="_blank">Pierre Chaumeil</a>
                </template>
              </AboutAvatar>

              <!-- Aaron -->
              <AboutAvatar>
                <template v-slot:image>
                  <img alt="Aaron Mussig" src="~/assets/images/gtdb-team/aaron.jpg">
                </template>
                <template v-slot:name>
                  <a href="https://ecogenomic.org/personnel/mr-aaron-mussig" target="_blank">Aaron Mussig</a>
                </template>
              </AboutAvatar>
            </div>
          </div>

          <!-- Alumni -->
          <div class="d-inline-block mt-2 about-block pa-2 rounded">
            <div class="d-block">
              <span style="font-size: 16px; font-weight: 500;">Alumni</span>
            </div>

            <div class="d-block">
              <!-- Adam -->
              <AboutAvatar>
                <template v-slot:image>
                  <img alt="Adam Skarshewski" src="~/assets/images/gtdb-team/adam.jpg">
                </template>
                <template v-slot:name>
                  <a href="https://ecogenomic.org/personnel/mr-adam-skarshewski" target="_blank">Adam Skarshewski</a>
                </template>
              </AboutAvatar>
            </div>
          </div>
        </div>
        <!-- End the team -->

        <v-flex class="mt-10">
          <span class="text-h5">Cite GTDB</span>
          <p>If you find the GTDB useful in your work please cite:</p>
          <ul class="mt-2">
            <li class="mt-3">
              Parks, D.H., et al. (2021). "<a
              href="https://academic.oup.com/nar/advance-article/doi/10.1093/nar/gkab776/6370255">GTDB:
              an ongoing census of bacterial and archaeal diversity through a phylogenetically consistent, rank
              normalized and complete genome-based taxonomy.</a>" <i>Nucleic Acids Research</i>,
              https://doi.org/10.1093/nar/gkab776.
            </li>
            <li class="mt-3">
              Rinke, C, et al. (2021). "<a href="https://www.nature.com/articles/s41564-021-00918-8" target="_blank">A
              standardized archaeal taxonomy for the Genome Taxonomy Database</a> <i>Nature Microbiology</i> 6,
              946–959 (2021).
              https://doi.org/10.1038/s41564-021-00918-8.
            </li>
            <li class="mt-3">
              Parks, D.H., et al. (2020). "<a href="https://rdcu.be/b3OI7" target="_blank">A complete domain-to-species
              taxonomy for Bacteria and Archaea.</a>" <i>Nature Biotechnology</i>,
              https://doi.org/10.1038/s41587-020-0501-8.
            </li>
            <li class="mt-3">
              Parks, D.H., et al. (2018).
              "<a href="https://www.nature.com/articles/nbt.4229" target="_blank">A standardized bacterial taxonomy
              based on genome phylogeny substantially revises the tree of life.</a>"
              <i>Nature Biotechnology</i>, <b>36</b>: 996-1004.
            </li>
          </ul>

          <p class="mt-5">Reclassification of Shigella species as synonyms of E. coli is discussed in:</p>
          <ul>
            <li class="mt-3">
              Parks, D.H., et al. (2021). "<a href="https://www.biorxiv.org/content/10.1101/2021.09.22.461432v1"
                                              target="_blank">Reclassification
              of Shigella species as later heterotypic synonyms of Escherichia coli in the Genome Taxonomy Database</a>"
              <i>bioRxiv</i>,
              https://doi.org/10.1101/2021.09.22.461432.
            </li>
          </ul>

          <p class="mt-5">If you use the GTDB-Tk please cite:</p>
          <ul>
            <li class="mt-3">
              Chaumeil, P.-A, et al. (2022). "<a href="https://doi.org/10.1093/bioinformatics/btac672" target="_blank">GTDB-Tk v2: memory friendly classification with the Genome Taxonomy Database</a>"
              <i>Bioinformatics</i>, <b>btac672</b>: https://doi.org/10.1093/bioinformatics/btac672.
            </li>
            <li class="mt-3">
              Chaumeil, P.-A, et al. (2019). "<a href="https://doi.org/10.1093/bioinformatics/btz848" target="_blank">GTDB-Tk:
              a toolkit to classify genomes with the Genome Taxonomy Database.</a>"
              <i>Bioinformatics</i>, <b>btz848</b>: https://doi.org/10.1093/bioinformatics/btz848.
            </li>
          </ul>
        </v-flex>


      </v-card-text>
    </v-card>

  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import AboutAvatar from "~/components/about/AboutAvatar.vue";
import {mdiApi, mdiWeb} from "@mdi/js";

export default Vue.extend({
  components: {AboutAvatar},
  head() {
    return {
      title: 'About',
      meta: [
        {
          hid: 'about',
          name: 'description',
          content: `Information about the Genome Taxonomy Database (GTDB).`
        }
      ]
    }
  },
  data() {
    return {
      latestStatsPageUrl: process.env.latestStatsPageUrl,
      apiVersion: '',
      nuxtVersion: process.env.nuxtVersion,

      // Icons
      mdiWebSvg: mdiWeb,
      mdiApiSvg: mdiApi,
    }
  },
  methods: {
    getApiVersion() {
      // @ts-ignore
      this.$api.meta.version().then((resp) => {
        this.apiVersion = `${resp.data.major}.${resp.data.minor}.${resp.data.patch}`
      })
    },
  },
  mounted() {
    this.getApiVersion()
  }
})
</script>

<style scoped>
.about-block {
  border: #dadada 1px solid;
}

.version-link-out a {
  color: #5b5b5b;
  text-decoration: none;
}

.version-link-out a:hover {
  color: #48a0da;
  text-decoration: none;
}

</style>
