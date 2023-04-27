<template>

  <!-- make this flex column when small -->
  <div class="d-flex fill-height flex-column flex-md-row">

    <!-- Left column (main) -->
    <div ref="gtdbmain" class="gtdb-main d-flex w-md-80 flex-grow-1 flex-column">

      <!-- First row -->
      <div class="d-flex flex-column">
        <NotifyBar uid="r214">
          *** GTDB Release 214 is now available 🎉
          <NuxtLink class="mx-1" to="/downloads">download files</NuxtLink>
          ***
        </NotifyBar>
        <NotifyBar uid="gtdbtkv2">
          *** Now published: <a class="mx-1" href="https://doi.org/10.1093/bioinformatics/btac672" target="_blank">GTDB-Tk
          v2: memory friendly classification with the Genome Taxonomy Database</a> ***
        </NotifyBar>
      </div>

      <!-- First row -->
      <div class="d-flex mt-5 mx-5">

        <!-- Top left -->
        <div class="d-flex w-50">
          <GtdbRankHistogram
            :c="nBacC"
            :f="nBacF"
            :g="nBacG"
            :o="nBacO"
            :p="nBacP"
            :s="nBacS"
            :total="nBacTot"
            d="Bacteria"
          >
          </GtdbRankHistogram>
        </div>

        <!-- Top right -->
        <div class="d-flex w-50">
          <div style="height: 70%; width: 100%;">
            <AceLogo></AceLogo>
          </div>
        </div>

      </div>

      <!-- Middle row -->
      <div class="d-flex flex-column flex-grow-1 mx-5">
        <div class="d-flex my-auto flex-column">
          <p class="gtdbSecond title-second text-center mb-0">Welcome to GTDB</p>
          <p class="gtdbHeader title-primary text-center mb-0">GENOME TAXONOMY DATABASE</p>
          <p class="gtdbSecond title-second text-center mb-0">{{ nGenomes.toLocaleString() }} genomes</p>
          <p class="gtdbSecond title-second text-center mb-0">Release {{ releaseVer }} ({{ releaseDate }})</p>
        </div>

      </div>

      <!-- Bottom row -->
      <div class="d-flex mb-5 mx-5">

        <!-- Bottom left -->
        <div class="d-flex align-end w-50">
          <div style="width: 50%; height: 50%;">
            <UqLogo/>
          </div>
        </div>

        <!-- Bottom right -->
        <div class="d-flex w-50">
          <GtdbRankHistogram
            :c="nArcC"
            :f="nArcF"
            :g="nArcG"
            :o="nArcO"
            :p="nArcP"
            :s="nArcS"
            :total="nArcTot"
            d="Archaea"
          ></GtdbRankHistogram>
        </div>

      </div>

    </div>

    <!-- Right column (twitter) -->
    <div class="d-flex w-md-20 flex-grow-0 flex-column fill-height" style="background-color: #f7f9f9 !important">
      <TwitterTimeline style="max-height: 90vh; overflow: auto;"></TwitterTimeline>
    </div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AceLogo from "~/components/layout/AceLogo.vue";
import UqLogo from "~/components/layout/UqLogo.vue";
import TwitterTimeline from "~/components/layout/TwitterTimeline.vue";
import GtdbRankHistogram from "~/components/index/GtdbRankHistogram.vue";
import NotifyBar from "~/components/index/NotifyBar.vue";

export default Vue.extend({
  components: {GtdbRankHistogram, TwitterTimeline, UqLogo, AceLogo, NotifyBar},
  head() {
    return {
      title: 'Genome Taxonomy Database',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'The Genome Taxonomy Database (GTDB) is an initiative to establish a standardised microbial taxonomy based on genome phylogeny.'
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: `gtdb, gtdb-tk, gtdbtk, genome taxonomy database, taxonomy, phylogeny, bacteria, archaea, genomes, genome, taxonomic, classification, classification, tree, trees, tree of life, phylogenetic, phylogenetic tree, phylogenetic trees, phylogenetic tree of life`
        }
      ],
    }
  },
  data: () => ({
    /* Bacterial stats */
    nBacTot: 394932,
    nBacS: 80789,
    nBacG: 19153,
    nBacF: 4264,
    nBacO: 1624,
    nBacC: 488,
    nBacP: 161,

    /* Archaeal stats */
    nArcTot: 7777,
    nArcS: 4416,
    nArcG: 1586,
    nArcF: 508,
    nArcO: 148,
    nArcC: 60,
    nArcP: 20,

    /* Summary stats */
    nGenomes: 402709,
    releaseVer: '08-RS214',
    releaseDate: '28th April 2023',
  }),
})
</script>

<style scoped>
.gtdb-main {
  background: url('~/assets/images/bg-lake-tree/bg-lake-tree.jpg') no-repeat center;
  background-size: cover;
  transition: all 0.25s ease-out;
}

.gtdbHeader {
  font-family: Bebas, serif;
  font-weight: bold;
  color: white;
}

.gtdbSecond {
  color: white;
}

@media (max-width: 575px) {
  .title-primary {
    font-size: 22px;
  }

  .title-second {
    font-size: 12px;
  }
}

@media (min-width: 576px) and (max-width: 767px) {
  .title-primary {
    font-size: 48px;
  }

  .title-second {
    font-size: 18px;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .title-primary {
    font-size: 48px;
  }

  .title-second {
    font-size: 18px;
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .title-primary {
    font-size: 62px;
  }

  .title-second {
    font-size: 21px;
  }
}

@media (min-width: 1200px) {
  .title-primary {
    font-size: 62px;
  }

  .title-second {
    font-size: 21px;
  }
}


</style>
