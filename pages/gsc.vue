<template>
  <v-container class="gtdb-container">

    <v-card>

      <v-card-title class="text-h5">
        Conference
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="text--primary">

        <img alt="GSC logo" src="~/assets/images/gsc-logo-sml.png">

        <div class="ml-3 mt-2">
          <h2>GSC21 Satellite meeting</h2>

          <p class="mt-2">
          The GSC will host a satellite on May 24, 2019, following the main meeting from the 21st to the 23rd.
            The theme of the meeting will be "<b>Cyanobacterial taxonomy and nomenclature</b>". The meeting will be an open event.
          </p>

          <p>
          <b>Organisers:</b><br>
            Philip Hugenholtz and Rochelle Soo
          </p>

          <p>
            <b>Background:</b><br>
            Historically, cyanobacterial nomenclature has been grounded in the Botanical Code because of their
            morphological resemblance to algae, hence the colloquial use of term blue-green algae. The recognition
            of Cyanobacteria as bacteria became the major impetus to formally distinguish Cyanobacteria from Cyanophyta
            (the botanical name for the group). The first proposal to transfer cyanobacterial nomenclature under the
            provision of the International Code of Nomenclature of Prokaryotes was in 1978 and since then there have
            been many more proposals, however the issue remains unresolved forty years later. This is due in part to
            the conundrum of long established names, including Anabaena, Nostoc and Gloeobacter, not being recognised
            by the Prokaryotic Code because they are validly published under the Botanical Code. Consequently only a
            handful of the cyanobacterial genera/species have been validly published under the Prokaryotic Code because
            they had not previously been named under the Botanical Code.
          </p>

          <p>
            In addition to the ongoing nomenclatural confusion, the Cyanobacteria are unique amongst the bacterial phyla
            in that they are still primarily classified based on their morphology, a legacy of being under the Botanical
            Code while the rest of the bacterial domain was being reshaped according to their phylogenetic relationships.
            Consequently, the current cyanobacterial classification is conspicuously at odds with any phylogenetic reconstruction of the group.
          </p>

          <p>
            The meeting will engage the cyanobacterial community to identify possible ways forward.
          </p>

          <p>
            <b>The Goals of the meeting:</b>
          </p>
          <ul>
            <li>Discuss the current issues of the taxonomy and nomenclature in the Cyanobacteria</li>
            <li>Propose a phylogenetic framework</li>
            <li>Determine nomenclature rules for populating the structure</li>
          </ul>

          <p>
            <b>Summary of Agenda:</b><br>
            The one day meeting will start with an overview of current issues. Speakers will then give their vision
            for the cyanobacterial taxonomy and nomenclature future. After lunch we will discuss possible paths
            forward, followed by Philip Hugenholtz introducing the <NuxtLink to="/">Genome Taxonomy Database</NuxtLink>. Following afternoon
            tea, we will have a cyanobacterial jamboree where we will invite attendees to annotate taxa in the GTDB.
            The day will conclude with a dinner.
          </p>

          <p>
            <b>Accomodation and meeting directions:</b><br>
            Please refer to the <a href="https://press3.mcs.anl.gov/gensc/meetings/gsc21/" target="_blank">GSC21 website</a>
            for recommendations and directions to the University of Vienna.
          </p>

        </div>

      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  head() {
    return {
      title: 'GSC21',
      meta: [
        {
          hid: 'gcs',
          name: 'description',
          content: `GCS21 conference.`
        }
      ]
    }
  },
})
</script>

<style scoped>

</style>
