<template>

  <v-container class="gtdb-container">

    <SectionedPage :items="items">

      <template #title>
        Methods
      </template>

      <template #gene-identification>
        Gene calling was performed with Prodigal v2.6.3
        <a href="https://doi.org/10.1186/1471-2105-11-119" target="_blank">(Hyatt et al., 2010)</a>
        and marker
        genes identified and aligned using HMMER v3.1b1
        <a href="https://doi.org/10.1371/journal.pcbi.1002195" target="_blank">(Eddy, 2011)</a>.
        Marker genes and corresponding HMMs are from the Pfam v33.1
        <a href="https://doi.org/10.1093/nar/gkt1223" target="_blank">(Finn et al., 2014)</a>
        and TIGRFAMs v15.0
        <a href="https://doi.org/10.1093/nar/gkg128" target="_blank">(Haft et al., 2003)</a>
        databases.
      </template>

      <template #multiple-sequence-alignment>
        Bacterial and archaeal multiple sequence alignments (MSAs) are formed from the concatenation of 120 (bac120)
        or 53 (arc53) phylogenetically informative markers, respectively. These markers are comprised of
        proteins or protein domains specified in the Pfam v33.1 or TIGRFAMs v15.0 databases. Details on
        these markers are available for download (<a href="https://data.ace.uq.edu.au/public/gtdb/data/releases/latest/" target="_blank">here</a>). Gene calling is performed with Prodigal v2.6.3,
        and markers identified and aligned using HMMER v3.1b1. Columns in the MSA with >50% gaps or with a
        single amino acid spanning <25% or >95% of taxa are removed. In order to reduce computational
        requirements of the bacterial reference tree, 42 amino acids per marker were randomly selected
        from the remaining columns to produce a MSA of ~5,000 columns. The final masks applied to the
        concatenated MSAs are available for download (<a href="https://data.ace.uq.edu.au/public/gtdb/data/releases/latest/" target="_blank">here</a>)
        and the identical filtering approach is implemented in <a href="https://github.com/ecogenomics/gtdbtk" target="_blank">GTDB-Tk</a>.
      </template>


      <template #tree-inference>
        <p>

          Bacteria reference tree is inferred with FastTree v2.1.10 under the WAG model
          from the concatenated alignment of 120 ubiquitous bacterial genes
          <a href="https://doi.org/10.1038/nbt.4229" target="_blank">(Parks et al., 2018)</a>.
        </p>
        <p class="mb-0">
          Archaea reference tree is inferred with IQ-Tree v2.1.2 under the PMSF model
          from the concatenated alignment of 53 archaeal genes based on a subset of the "top-ranked marker proteins"
          from a recent evaluation based on minimizing horizontal gene transfer and optimising the recovery of monophyletic lineages
          <a href="https://doi.org/10.1038/s41467-020-17408-w" target="_blank">(Rinke & Spang et al., 2020)</a>,
          using FastTree v2.1.10 to infer an initial guide tree.
        </p>
      </template>

      <template #identifying-16s-rrna-sequences>
        <p class="mb-0">
          Sequences are identified using nhmmer v3.1b2
          <a href="https://doi.org/10.1093/bioinformatics/btt403" target="_blank">(Wheeler and Eddy, 2013)</a>
          with the 16S rRNA model (RF00177) from the RFAM database
          <a href="https://doi.org/10.1093/nar/gkx1038" target="_blank">(Kalvari et al., 2018)</a>.
        </p>
      </template>

      <template #average-nucleotide-identity>
        <p class="mb-0">
          Average nucleotide identity (ANI) and alignment fraction (AF) values were calculated
          with FastANI v1.3
          <a href="https://doi.org/10.1038/s41467-018-07641-9" target="_blank">(Jain et al., 2018)</a>.
        </p>
      </template>

      <template #genome-qc-criteria>
        <p>
          Genomes are obtained from NCBI and must meet the following criteria to be included in
          the GTDB reference trees and database:
        </p>
        <ol type="i">
          <li>CheckM completeness estimate >50%</li>
          <li>CheckM contamination estimate <10%</li>
          <li>quality score, defined as completeness - 5*contamination, >50</li>
          <li>contain >40% of the bac120 or ar53 marker genes</li>
          <li>contain <1000 contigs</li>
          <li>have an N50 >5kb</li>
          <li>contain <100,000 ambiguous bases</li>
        </ol>
        <p class="mb-0">
          Filtered genomes are manually inspected and exceptions are made for genomes of high
          nomenclatural or taxonomic significance, e.g. the isolate genome
          <nuxt-link to="/tree?r=s__Ktedonobacter%20racemifer" target="_blank">Ktedonobacter racemifer</nuxt-link>
          representing the class
          <nuxt-link to="/tree?r=c__Ktedonobacteria" target="_blank">Ktedonobacteria</nuxt-link>
          in the phylum
          <nuxt-link to="/tree?r=p__Chloroflexota" target="_blank">Chloroflexota</nuxt-link>
          has a contamination
          estimate of 11%. Genomes with CheckM contamination between 10% and 20% which pass criteria
          i and iv to vii are also retained if >80% of all duplicate marker genes are 100% identical
          as this suggest a large legitimate genome duplication event, e.g.
          <nuxt-link to="/genome?gid=GCF_004799645.1" target="_blank">GCF_004799645.1</nuxt-link>, a
          complete isolate genome from the type strain of
          <nuxt-link to="/tree?r=s__Natronorubrum%20bangense" target="_blank">Natronorubrum bangense</nuxt-link>.
        </p>
      </template>


      <template #updating-gtdb-species-representatives>
        <p>
          Each GTDB species is defined by a single representative genome and species assignments
          established by considering the ANI and AF to these representative genomes (Parks et al.,
          Nature Biotechnology, 2019). Species representatives are re-evaluated each GTDB release
          with an emphasis placed on retaining representatives so they can serve as effective
          nomenclatural type material. However, the goal of stable representatives must be balanced
          with the desire to use high-quality genomes as representatives, the incorporation of
          changing taxonomic opinion, and identified errors in genome classification or assembly.
        </p>
        <p>
          GTDB representatives are updated according to two primary principles: i) representatives
          should be assembled from the type strain of a species whenever possible, and ii) representatives
          should only be replaced by assembles of suitably higher overall quality. These two principles
          are quantitatively defined by the balanced ANI score (BAS) given by:
          <code>0.5 * (ANI score) + 0.5 * (quality score)</code>
          where the ANI score is 100 – 20*(100 - ANI to current representative) and the quality
          score is defined by the criteria given in Table 1.
        </p>
        <p>
          An existing representative is only
          replaced by a new representative if it has a BAS >= 10 above the BAS of the current
          representative. Intuitively, the BAS achieves the goal of stable representatives by
          requiring a new representative to be of increasingly higher quality (as defined by the
          quality score) the more dissimilar it is from the current representative (as defined by
          the ANI score).
        </p>
        <p>
          Representatives are also updated to account for genome assemblies being removed from
          NCBI and representatives are updated whenever the underlying assembly is updated at NCBI.
        </p>

        <b>TABLE 1. Criteria used to establish assembly quality score</b>

        <v-simple-table class="gtdb-table mt-1" dense>
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">
                Criteria
              </th>
              <th class="text-left">
                Score
              </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>Type species of genome</td>
              <td>100,000</td>
            </tr>
            <tr>
              <td>Effective type strain of species according to NCBI</td>
              <td>10,000</td>
            </tr>
            <tr>
              <td>NCBI representative of species</td>
              <td>1,000</td>
            </tr>
            <tr>
              <td>Complete genome</td>
              <td>100</td>
            </tr>
            <tr>
              <td>CheckM quality estimate</td>
              <td>completeness - 5*contamination</td>
            </tr>
            <tr>
              <td>MAG or SAG</td>
              <td>-100</td>
            </tr>
            <tr>
              <td>Contig count</td>
              <td>-5 * (no. contigs/100)</td>
            </tr>
            <tr>
              <td>Undetermined bases</td>
              <td>-5 * (no. undetermined bases/10,000)</td>
            </tr>
            <tr>
              <td>Full length 16S rRNA gene</td>
              <td>10</td>
            </tr>
            <tr>
              <td>Many frameshifted proteins according to NCBI</td>
              <td>-25</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </template>

      <template #identification-of-strain-identifiers>
        <p class="mb-0">
          Strain identifiers are obtained from NCBI by parsing the 'isolate' and 'strains' fields in the assembly_report.txt, wgsmaster.gbff,
          and genomic.gbff files associated with each genome.
        </p>
      </template>


      <template #updating-name-of-gtdb-species-clusters>
        <p>
          The names assigned to GTDB species clusters are re-evaluated each GTDB release with an
          emphasize placed on nomenclature stability. However, names are changed in some cases to
          reflect changes in taxonomic opinions and/or to correct identified errors in GTDB or NCBI
          assignments. Species clusters containing one or more genomes assembled from the type strain
          of a species are named after the species with nomenclatural priority
          <a href="https://doi.org/10.1099/ijsem.0.000778" target="_blank">(Parker et al., 2019)</a>,
          with the generic and specific names changed as necessary to reflect any genus level
          reclassifications in the GTDB. Species names identified as synonyms are provided as separated
          file in the GTDB repository and updated each release.
        </p>
        <p>
          Species clusters without a type strain genome are assigned via a majority voting approach
          based on NCBI species assignments regarded as correct under the GTDB framework. A genome is
          considered to have an erroneous NCBI species assignment if a genome assembled from the type
          strain of this species exists and resides in a different GTDB species cluster. A cluster is
          assigned a name by majority voting if >50% of genomes in the cluster with a GTDB-validated NCBI
          name are from a single species and >50% of all genomes with this species classification are in
          the cluster. Otherwise, the species cluster is assigned an alphanumeric or Latin suffixed
          placeholder name. In order to maximize the stability of GTDB names, placeholder names are not
          updated to new placeholder names (e.g., Bacillus sp002153395 to B. subtilis_A or vice versa) even
          if an updated placeholder name might better reflect the current classification of genomes within
          a cluster.
        </p>
        <p class="mb-0">
          Species clusters containing an assembly from the type strain of a subspecies or a subspecies
          satisfying the majority voting criteria will have the subspecies name promoted to the specific
          name of the cluster in cases where a placeholder name would otherwise be required.
        </p>
      </template>


      <template #additional-information>
        <p>
          Please consult the following GTDB publications for additional information:
        </p>
        <p>
          <a href="https://doi.org/10.1038/nbt.4229" target="_blank">
            Parks, D. H., et al. (2018). A standardized bacterial taxonomy based on genome
            phylogeny substantially revises the tree of life. Nature Biotechnology,
            36: 996-1004.
          </a>
        </p>
        <p>
          <a href="https://doi.org/10.1038/s41587-020-0501-8" target="_blank">
            Parks, D.H., et al. (2020). A complete domain-to-species taxonomy for Bacteria
            and Archaea. Nature Biotechnology, https://doi.org/10.1038/s41587-020-0501-8.
          </a>
        </p>
        <p class="mb-0">
          <a href="https://doi.org/10.1093/bioinformatics/btz848" target="_blank">
            Chaumeil P-A, et al. (2019). GTDB-Tk: a toolkit to classify genomes with the
            Genome Taxonomy Database. Bioinformatics, btz848:
            https://doi.org/10.1093/bioinformatics/btz848.
          </a>
        </p>
      </template>


      <template #references>
        <p>
          <a href="https://doi.org/10.1371/journal.pcbi.1002195" target="_blank">
            Eddy SR. 2011. Accelerated Profile HMM Searches. PLoS Comput Biol 7: e1002195.
          </a>
        </p>
        <p>
          <a href="https://doi.org/10.1093/nar/gkt1223" target="_blank">
            Finn RD, et al. 2014. Pfam: The protein families database. Nucleic Acids Res
            42: D222-230.
          </a>
        </p>
        <p>
          <a href="https://doi.org/10.1093/nar/gkg128" target="_blank">
            Haft DH, Selengut JD, White O. 2003. The TIGRFAMs database of protein families.
            Nucl Acids Res 31: 371-373.
          </a>
        </p>
        <p>
          <a href="https://doi.org/10.1186/1471-2105-11-119" target="_blank">
            Hyatt D, Chen GL, Locascio PF, Land ML, Larimer FW, Hauser LJ. 2010.
            Prodigal: Prokaryotic gene recognition and translation initiation site
            identification. BMC Bioinformatics 11: 119.
          </a>
        </p>
        <p>
          <a href="https://doi.org/10.1038/s41467-018-07641-9" target="_blank">
            Jain C, et al. (2018). High throughput ANI analysis of 90K prokaryotic genomes
            reveals clear species boundaries. Nature Communication 9: 5114.
          </a>
        </p>
        <p>
          <a href="https://doi.org/10.1093/nar/gkx1038" target="_blank">
            Kalvari I, et al. 2018. Rfam 13.0: shifting to a genome-centric resource for
            non-coding RNA families. Nucleic Acids Res. 46(D1):D335-D342.
          </a>
        </p>
        <p>
          <a href="https://doi.org/10.1099/ijsem.0.000778" target="_blank">
            Parker et al. International Code of Nomenclature of Prokaryotes. IJSEM 60:
            doi: 10.1099/ijsem.0.000778.
          </a>
        </p>
        <p>
          <a href="https://doi.org/10.1038/s41564-017-0012-7" target="_blank">
            Parks DH, et al. 2017. Recovery of nearly 8,000 metagenome-assembled genomes
            substantially expands the tree of life. Nat Microbiol 2: 1533-42.
          </a>
        </p>
        <p class="mb-0">
          <a href="https://doi.org/10.1093/bioinformatics/btt403" target="_blank">
            Wheeler TJ, Eddy SR. 2013. nhmmer: DNA homology search with profile HMMs.
            Bioinformatics. 2013 Oct 1;29(19):2487-9.
          </a>
        </p>
      </template>

    </SectionedPage>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import SectionedPage from "~/components/layout/SectionedPage.vue";

export default Vue.extend({
  components: {SectionedPage},
  head() {
    return {
      title: 'Methods',
      meta: [
        {
          hid: 'methods',
          name: 'description',
          content: `Methods used in the inference of the GTDB.`
        }
      ]
    }
  },
  data: () => ({
    items: [
      {text: 'Gene identification', ref: 'gene-identification'},
      {text: 'Multiple sequence alignment', ref: 'multiple-sequence-alignment'},
      {text: 'Tree inference', ref: 'tree-inference'},
      {text: 'Identifying 16S rRNA sequences', ref: 'identifying-16s-rrna-sequences'},
      {text: 'Average nucleotide identity', ref: 'average-nucleotide-identity'},
      {text: 'Genome QC criteria', ref: 'genome-qc-criteria'},
      {text: 'Updating GTDB species representatives', ref: 'updating-gtdb-species-representatives'},
      {text: 'Identification of strain identifiers', ref: 'identification-of-strain-identifiers'},
      {text: 'Updating name of GTDB species clusters', ref: 'updating-name-of-gtdb-species-clusters'},
      {text: 'Additional information', ref: 'additional-information'},
      {text: 'References', ref: 'references'}
    ]
  }),
})
</script>

<style scoped>


</style>
