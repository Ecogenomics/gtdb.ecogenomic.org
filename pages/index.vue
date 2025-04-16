<template>

  <!-- Default container for all content on the main page -->
  <div class="fill-height w-100 d-flex flex-column align-stretch">

    <!-- Main content -->
    <div ref="gtdbmain" class="gtdb-main d-flex w-100 flex-grow-1 flex-column" style="min-height: 200px;">

      <!-- First row -->
      <div class="d-flex flex-column">
        <NotifyBar uid="r226">
          *** GTDB Release 226 is now available 🎉
          <NuxtLink class="mx-1" to="/downloads">download files</NuxtLink>
          ***
        </NotifyBar>
        <NotifyBar uid="r226-gtdbtk">
          *** GTDB-Tk has been updated to use the R226 taxonomy from <span class="mx-1"><a
          href="https://ecogenomics.github.io/GTDBTk/installing/index.html" target="_blank">vXXX</a></span>***
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
        <div class=" d-block d-md-flex w-50">
          <div class="w-100 w-md-50 mb-0 mt-auto" style="height: 50%">
            <UqLogo/>
          </div>
          <div class="w-100 w-md-50 mb-0 mt-auto" style="height: 50%">
            <ArcLogo/>
          </div>

<!--          <div class="w-100 pb-2 pl-md-16" style="height: 50%;">-->
<!--          </div>-->
<!--          <div class="w-100 pt-2 pl-md-16" style="height: 50%;">-->
<!--          </div>-->
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
    <!--    <div class="d-flex w-md-20 flex-grow-0 flex-column fill-height" style="background-color: #f7f9f9 !important">-->
    <!--      <TwitterTimeline style="max-height: 90vh; overflow: auto;"></TwitterTimeline>-->
    <!--    </div>-->

    <!-- Twitter footer -->
<!--    <div class="d-block" style="height: 40px;">-->
<!--      <TwitterFooter/>-->
<!--    </div>-->

  </div>

</template>

<script lang="ts">
import Vue from 'vue'
import AceLogo from "~/components/layout/AceLogo.vue";
import ArcLogo from "~/components/layout/ArcLogo.vue";
import UqLogo from "~/components/layout/UqLogo.vue";
import TwitterTimeline from "~/components/layout/TwitterTimeline.vue";
import GtdbRankHistogram from "~/components/index/GtdbRankHistogram.vue";
import NotifyBar from "~/components/index/NotifyBar.vue";
import TwitterFooter from "~/components/layout/TwitterFooter.vue";

export default Vue.extend({
  components: {ArcLogo, TwitterFooter, GtdbRankHistogram, TwitterTimeline, UqLogo, AceLogo, NotifyBar},
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
    nBacTot: 715230,
    nBacS: 136646,
    nBacG: 27326,
    nBacF: 5311,
    nBacO: 1976,
    nBacC: 571,
    nBacP: 169,

    /* Archaeal stats */
    nArcTot: 17245,
    nArcS: 6968,
    nArcG: 2079,
    nArcF: 603,
    nArcO: 171,
    nArcC: 63,
    nArcP: 20,

    /* Summary stats */
    nGenomes: 732475,
    releaseVer: '10-RS226',
    releaseDate: '16th April 2025',
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
