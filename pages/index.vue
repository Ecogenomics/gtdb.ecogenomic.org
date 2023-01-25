<template>

  <!-- make this flex column when small -->
  <div class="d-flex fill-height flex-column flex-md-row">

    <!-- Left column (main) -->
    <div class="gtdb-main d-flex w-md-80 flex-grow-1 flex-column">

      <!-- First row -->
      <div class="d-flex flex-column">
        <NotifyBar uid="r207">
          *** GTDB Release 207 is now available 🎉 <NuxtLink to="/downloads" class="mx-1">download files</NuxtLink> ***
        </NotifyBar>
        <NotifyBar uid="gtdbtkv2">
          *** Now published: <a href="https://doi.org/10.1093/bioinformatics/btac672" class="mx-1" target="_blank">GTDB-Tk v2: memory friendly classification with the Genome Taxonomy Database</a> ***
        </NotifyBar>
        <NotifyBar uid="outage-2023-02-14" :age="259200">
          *** The GTDB will be periodically unavailable between <a href="https://www.worldtimebuddy.com/?qm=1&lid=2174003,1850147,1816670,2950159,2643743,5128581,5368361&h=2174003&date=2023-2-14&sln=9-17&hf=1" target="_blank">2022/02/13 11PM GMT and 2022/02/14 7AM GMT</a> while our host performs critical maintenance. ***
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
    <div class="d-flex w-md-20 flex-grow-0">
      <TwitterTimeline style="max-height: 90vh; overflow: hidden;"></TwitterTimeline>
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
          hid: 'index',
          name: 'description',
          content: 'The Genome Taxonomy Database (GTDB) is an initiative to establish a standardised microbial taxonomy based on genome phylogeny.'
        }
      ]
    }
  },
  data: () => ({
    /* Bacterial stats */
    nBacTot: 311480,
    nBacS: 62291,
    nBacG: 15342,
    nBacF: 3614,
    nBacO: 1439,
    nBacC: 425,
    nBacP: 148,

    /* Archaeal stats */
    nArcTot: 6062,
    nArcS: 3412,
    nArcG: 1344,
    nArcF: 456,
    nArcO: 132,
    nArcC: 52,
    nArcP: 18,

    /* Summary stats */
    nGenomes: 6062+311480,
    releaseVer: '07-RS207',
    releaseDate: '8th April 2022'

  })
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
