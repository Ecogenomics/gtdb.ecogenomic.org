<template>
  <v-container class="gtdb-container">

  <SectionedPage :items="items">

      <template #title>
        Frequently Asked Questions
      </template>

      <template #how-can-i-classify-my-own-genomes-with-the-gtdb>
        We have developed a stand-alone application called
        <a href="https://github.com/Ecogenomics/GTDBTk" target="_blank">GTDB-Tk</a>.
        A specific FAQ for GTDB-Tk can be found <a href="https://ecogenomics.github.io/GTDBTk/" target="_blank">here</a>.
      </template>

      <template #what-is-the-gtdb-versioning-scheme>
        The GTDB version indicates both the GTDB and RefSeq release numbers. For example, R05-RS95 designates the fifth
        release of the GTDB and indicates reference genomes were obtained from RefSeq release 95.
      </template>

      <template #why-has-the-suffix-of-phyla-names-been-changed-to--ota>
        This is based on a Whitman et al. (2018) proposal to normalise the suffix of the rank of phylum as is done with
        other ranks. See
        the <a href="https://www.microbiologyresearch.org/content/ijsem/10.1099/ijsem.0.002593.T1" target="_blank">Microbiology
        Society website</a>.
      </template>

      <template #why-are-some-genus-names-formed-from-a-strain-identifier>
        A strain identifier is used as a placeholder for the genus name when there is no existing genus name and no
        binomially named representative genome. For example, the genome GCF_000318095.2 has the NCBI organism name
        Prevotella sp. oral taxon 473 str. F0040. However, this genome is more closely related to Prevotellamassilia and
        Alloprevotella. Consequently, we assign it to the placeholder genus g__F0040. If the organism had been assigned
        a binomial species name such as Prevotella oralitaxus str. F0040 we would assign it to the placeholder genus
        g__Prevotella_A to indicate it is not a true Prevotella species, but that there are representative genomes that
        have been assigned to a species.
      </template>

      <template #why-do-some-genus-and-species-names-end-with-an-alphabetic-suffix>
        <p>
          Genus names ending with an alphabetic suffix indicate genera that are i) polyphyletic according to the current
          GTDB reference tree, or ii) subdivided based on taxonomic rank normalisation according to the current GTDB
          reference tree.
        </p>
        <p>
          Species names end with an alphabetic suffix if the GTDB species cluster is (or was previously) associated with
          a species name, but the correct application of this name is ambiguous or the name assigned to a different GTDB
          species cluster based on the presence of type material or via majority voting.
        </p>
        <p class="mb-0">
          The lineage or species cluster containing the nomenclature type or, in case of species, satisfying the
          majority vote criteria retains the unsuffixed name and all other lineages/clusters are given alphabetic
          suffixes, indicating that they are placeholder names that need to be replaced in due course. A best effort is
          made to retain the same alphabetical suffix for a taxon between GTDB releases, but this is not guaranteed.
        </p>
      </template>

      <template #why-do-some-family-and-higher-rank-names-end-with-an-alphabetic-suffix>
        <p>
          Taxon names above the rank of genus appended with an alphabetic suffix indicate groups that are under the
          following category: i) groups that are not monophyletic in the GTDB reference tree, but for which there exists
          alternative evidence that they are monophyletic groups; ii) groups whose placement is unstable between
          releases.
        </p>
        <p class="mb-0">
          A best effort is made to retain the same alphabetical suffix for a taxon between GTDB releases, but this is
          not guaranteed.
        </p>
      </template>

      <template #what-criteria-are-used-to-select-genomes-for-inclusion-in-the-gtdb>
        <p>Genomes are obtained from NCBI and must meet the following criteria to
          be included in the GTDB reference trees
          and database:</p>
        <ol type="i">
          <li>CheckM completeness estimate &gt;50%</li>
          <li>CheckM contamination estimate &lt;10%</li>
          <li>quality score, defined as completeness - 5*contamination, &gt;50</li>
          <li>contain &gt;40% of the bac120 or arc53 marker genes</li>
          <li>contain &lt;1000 contigs</li>
          <li>have an N50 &gt;5kb</li>
          <li>contain &lt;100,000 ambiguous bases</li>
        </ol>
        Filtered genomes are manually inspected and exceptions are made for genomes of high
        nomenclatural or taxonomic
        significance, e.g. the isolate genome <i>Ktedonobacter racemifer</i> representing the class
        Ktedonobacteria in the phylum
        Chloroflexota has a contamination estimate of 11%. Genomes with CheckM contamination between
        10% and 20% which pass critieria
        i and iv to vii are also retained if >80% of all duplicate marker genes are 100% identical
        as this suggest a large legitimate
        genome duplication event, e.g. GCF_004799645.1, a complete isolate genome from the type
        strain of <i>Natronorubrum bangense</i>.
        <br>
      </template>

      <template #how-are-the-bacterial-and-archaeal-multiple-sequence-alignments-constructed>
        <p>
          Bacterial and archaeal multiple sequence alignments (MSAs) are formed from the concatenation of 120 (bac120)
          or 53 (arc53) phylogenetically informative markers, respectively. These markers are comprised of proteins or
          protein domains specified in the Pfam v33.1 or TIGRFAMs v15.0 databases. Details on these markers are
          available for download (<a href="https://data.ace.uq.edu.au/public/gtdb/data/releases/latest/" target="_blank">here</a>). Gene calling is performed with Prodigal v2.6.3, and markers identified
          and aligned using HMMER v3.1b1. Columns in the MSA with >50% gaps or with a single amino acid spanning
          <25% or >95% of taxa are removed. In order to reduce computational requirements of the bacterial reference
          tree, 42 amino acids per marker were randomly selected from the remaining columns to produce a MSA of
          ~5,000 columns. The final masks applied to the concatenated MSAs are available for download (<a
          href="https://data.ace.uq.edu.au/public/gtdb/data/releases/latest/" target="_blank">here</a>) and
          the identical filtering approach is implemented in <a
          href="https://github.com/ecogenomics/gtdbtk" target="_blank">GTDB-Tk</a>.<br>.
        </p>
      </template>

      <template #how-are-the-bacterial-and-archaeal-reference-trees-inferred>
        Bacterial and archaeal reference trees are inferred from the filtered
        bac120 and ar53 multiple sequence
        alignments, respectively. Reference trees contain 1 genome per GTDB species cluster. The
        bacterial reference
        tree is inferred with FastTree v2.1.10 under the WAG model. The archaeal reference tree
        is inferred with IQ-Tree
        v1.6.9 under the PMSF model, a rapid approximation of the C10 mixture model
        (LG+C10+F+G), using FastTree v2.1.10
        to infer an initial guide tree. Both trees contain non-parametric bootstrap support
        values.
      </template>

      <template #how-are-gtdb-species-clusters-formed>
        <p>The full methodology used to establish species clusters is described in:<br>
          Parks, D.H., et al. (2020). "<a href="https://rdcu.be/b3OI7" target="_blank">A complete
            domain-to-species
            taxonomy for Bacteria and Archaea.</a>" <i>Nature Biotechnology</i>,
          https://doi.org/10.1038/s41587-020-0501-8.
          <br>
        </p>
        Briefly, species clusters are formed as follows:<br>
        <ol>
          <li>Identify a GTDB representative genome for each validly or effectively published
            species with one or more
            genomes passing quality control. In most cases this will be a genome sequenced from
            the type strain of the
            species. When this is not possible, the representative genome is selected based on
            its quality and with
            consideration to additional metadata (e.g., NCBI reference or representative genome,
            genome assembled from type
            strain of subspecies).
          </li>
          <li>Assign genomes to selected GTDB representative genomes using average nucleotide
            identity (ANI) and alignment
            fraction (AF) criteria. GTDB uses an ANI circumscription radius of 95%, though
            permits this to be as high as 97%
            in order to retain a larger number of existing species names. Species with an ANI
            >97% are synonyms within the
            GTDB. Species assignments use an AF of 50% as of R07-RS207 and 65% prior to this release.
            ANI and AF values are calculated with <a
              href="https://github.com/ParBLiSS/FastANI" target="_blank">FastANI</a> v1.3.
          </li>
          <li>Remaining genomes are formed into <i>de novo</i> species clusters using a greedy
            clustering approach that emphasizes
            selecting representative genomes of high quality. This clustering consists of 3
            steps: i) sort remaining genomes
            by their estimated genome quality, ii) select the highest-quality genome to form a
            new species cluster, and iii)
            assign genomes to this species cluster using the ANI and AF criteria. These steps
            are repeated until all genomes
            have been assigned to a species.
          </li>
        </ol>
      </template>

      <template #how-are-placeholder-genus-names-formed>
        <p> An internal node representing a genus without any descendant genomes
          with validly or effectively published
          genus names is assigned a placeholder name. This placeholder genus name is generally
          derived from the oldest
          representative genome within the lineage and formed, in priority order, from the: </p>
        <ol type="i">
          <li>NCBI organism name,</li>
          <li>NCBI infraspecific/strain ID,</li>
          <li>NCBI WGS identifier, or</li>
          <li>NCBI genome assembly ID</li>
        </ol>
        <p class="mb-0">Many of these placeholder names have been automatically generated with manual inspection
          used to modify names to
          more suitable, human-readable names when appropriate.<br>
        </p>
      </template>

      <template #how-is-the-specific-name-of-novel-gtdb-species-clusters-formed>
        GTDB species clusters without any validly or effectively published
        specific name are assigned a placeholder name
        which is formed from the NCBI accession number of the GTDB representative genome of the
        species. For example,
        if GCF_000192635.1 is the representative genome of a species cluster within the genus
        <i>Agrobacterium</i> the cluster will be named Agrobacterium sp000192635. Representative
        genomes of a GTDB species cluster are
        updated between releases when genomes of sufficiently higher quality become available,
        but placeholder names are not updated as
        preference is given to the stability of names. As a consequence, the placeholder name of
        GTDB species clusters may not reflect the
        current representative genome.<br>
      </template>

      <template #how-are-the-number-of-taxa-at-each-rank-counted>
        Each taxon at the rank of species and genus are counted, including
        those with an alphabetic suffix.
        For ranks higher than genus, suffixed names are collapsed and counted once
        (e.g. Firmicutes, Firmicutes_A, Firmicutes_B, ... is counted as a single phylum).
      </template>

      <template #how-are-gtdb-species-representatives-updated-with-each-release>
        <p>Each GTDB species is defined by a single representative genome and
          species assignments established by considering the ANI
          and AF to these representative genomes (Parks et al., Nature Biotechnology, 2020).
          Species representatives are re-evaluated each GTDB
          release with an emphasis placed on retaining representatives so they can serve as
          effective nomenclatural type material.
          However, the goal of stable representatives must be balanced with the desire to use
          high-quality genomes as representatives,
          the incorporation of changing taxonomic opinion, and identified errors in genome
          classification or assembly.</p>
        <p>
          GTDB representatives are updated according to two primary principles: i) representatives
          should be assembled from the type strain
          of a species whenever possible, and ii) representatives should only be replaced by
          assemblies of suitably higher overall quality.
          These two principles are quantitatively defined by the balanced ANI score (BAS) which is
          0.5 * (ANI score) + 0.5 * (quality score),
          where the ANI score is 100 – 20 * (100 - ANI to current representative) and the quality
          score is defined by the criteria given in Table 1.
          An existing representative is only replaced by a new representative if it has a BAS &ge;
          10 above the BAS of the current representative.
          Intuitively, the BAS achieves the goal of stable representatives by requiring a new
          representative to be of increasingly higher
          quality (as defined by the quality score) the more dissimilar it is from the current
          representative (as defined by the ANI score).
        <p>
        <p>
          Representatives are also updated to account for genome assemblies being removed from
          NCBI and representatives are updated whenever the underlying assembly is updated at
          NCBI.</p>

        <b>Table 1</b>. Criteria used to establish quality score of an assembly
        <v-simple-table class="gtdb-table mt-2" dense style="max-width: 800px;">
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">CRITERIA</th>
              <th class="text-left">SCORE</th>
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
            </tbody>
          </template>
        </v-simple-table>
      </template>

      <template #how-are-the-names-of-gtdb-species-clusters-updated-with-each-release>
        <p>The names assigned to GTDB species clusters are re-evaluated each GTDB release with an
          emphasis placed on nomenclature stability.
          However, names are changed in some cases to reflect changes in taxonomic opinions and/or
          to correct identified errors in GTDB or NCBI assignments.
          Species clusters containing one or more genomes assembled from the type strain of a
          species are named after the species with nomenclatural priority (Parker et al., 2019),
          with the generic and specific names changed as necessary to reflect any genus level
          reclassifications in the GTDB. Species names identified as synonyms are provided as
          separate files in the GTDB repository and updated each release.</p>

        <p> Species clusters without a type strain genome are assigned via a majority voting
          approach based on NCBI species assignments regarded as correct under the GTDB framework.
          A genome is considered to have an erroneous NCBI species assignment if a genome
          assembled from the type strain of this species exists and resides in a
          different GTDB species cluster. A cluster is assigned a name by majority voting if >50%
          of genomes in the cluster with a GTDB-validated NCBI name are from
          a single species and >50% of all genomes with this species classification are in the
          cluster. Otherwise, the species cluster is assigned an alphanumeric or Latin suffixed
          placeholder name.
          In order to maximize the stability of GTDB names, placeholder names are not updated to
          new placeholder names (e.g., Bacillus sp002153395 to B. subtilis_A or vice versa) even
          if an updated
          placeholder name might better reflect the current classification of genomes within a
          cluster. </p>

        <p class="mb-0">Species clusters containing an assembly from the type strain of a subspecies or a
          subspecies satisfying the majority voting criteria will have the
          subspecies name promoted to the specific name of the cluster in cases where a
          placeholder name would otherwise be required.</p>
      </template>

      <template #why-has-the-priority-rule-been-violated-for-a-number-of-selected-taxa-that-were-merged-in-gtdb>
        In GTDB, we violate the rule of priority in cases where correct names may lead to
        confusion (see Rule 38, ICNP).
        Such situations may happen when a taxon, whose name is considered as a later heterotypic
        synonym in GTDB,
        serves as a nomenclature type of its parent taxon or when the name of the earlier
        synonym is typified by a
        type genus different from that of a parent taxon. Implementation of the correct name in
        such cases can
        result in classifications that are likely to cause confusion.
        <br><br>
        For instance, after merging families Burkholderiaceae, Alcaligenaceae, Comamonadaceae
        and
        Sutterellaceae in GTDB, we chose to name the merged taxon Burkholderiaceae. This results
        in the
        classification o__Burkholderiales; f__Burkholderiaceae; g__Burkholderia. Application of
        correct
        name with priority, Alcaligenaceae, would result in the ‘virtual’ absence of the family
        name
        f__Burkholderiaceae as the classification would be o__Burkholderiales;
        f__Alcaligenaceae; g__Burkholderia.
        We believe that it is more logical and practical to preserve both order and family names
        based on the same
        type genus in taxonomy in order to know what genus (type) is included in the taxon. This
        aids in reclassification
        and typification of this and other taxa. Another example of name with the lower priority
        applied to GTDB taxon
        (and elsewhere) is the order name <i>Rhizobiales</i> that is regarded as illegitimate
        since the order contains the
        type genus of another order <i>Hyphomicrobiales</i> that has priority
        (see <a href="https://pubmed.ncbi.nlm.nih.gov/32373076/" target="_blank">https://pubmed.ncbi.nlm.nih.gov/32373076/</a>).
      </template>

      <template #what-nomenclatural-resources-does-the-gtdb-use-for-determining-validly-published-names>
        GTDB makes extensive use of the <a href="https://lpsn.dsmz.de/" target="_blank">LPSN</a>
        and makes a best effort to follow the International Code of Nomenclature of Prokaryotes.
      </template>

      <template #where-can-i-find-details-on-the-methods-used-by-the-gtdb>
        The methodology used by the GTDB changes over times in order to reflect
        best practices in the field and updates to reference databases. As such,
        a separate METHODS file is provided with each GTDB release.
        You can find the methods used in the latest GTDB release
        at: <a href="https://data.gtdb.ecogenomic.org/releases/latest/METHODS" target="_blank">https://data.gtdb.ecogenomic.org/releases/latest/METHODS</a>
      </template>

    <template #why-doesnt-the-gtdb-contain-shigella-species>
      Shigella species are considered heterotypic synonyms of E. coli
      <a href="https://doi.org/10.1101/2021.09.22.461432" target="_blank">(Parks et al., 2021)</a>
    </template>

    <template #why-do-some-names-not-appear-in-the-gtdb-taxonomy>
      Effectively published Latin names above the rank of genus without designated type material,
      either a sequenced type strain or MAG, will no longer be incorporated into GTDB, and those that do
      will only be introduced when the associated type genome is present in GTDB. This change is necessary as
      establishing the correct interior node in the reference tree for taxa without type material can be ambiguous,
      particularly when the addition of new genomes or alternative inference methods results in the named taxon
      becoming polyphyletic in later releases.
    </template>

      <template #references>
        <p>Oren A, et al. (2015). Proposal to include the rank of phylum in the international code
          of nomenclature of
          prokaryotes. <i>Int J Syst Evol Microbiol</i> <b>65</b>, 4284-4287.</p>
        <p>Whitman WB, et al. (2018). Proposal of the suffix -ota to denote phyla. Addendum to
          'Proposal to include the rank
          of phylum
          in the International Code of Nomenclature of Prokaryotes'. <i>Int J Syst Evol
            Microbiol</i> <b>68</b>, 967-969.
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
      title: 'FAQ',
      meta: [
        {
          hid: 'faq',
          name: 'description',
          content: `Frequently asked questions about the GTDB.`
        }
      ]
    }
  },
  data: () => ({
    items: [
      {
        text: 'How can I classify my own genomes with the GTDB?',
        ref: 'how-can-i-classify-my-own-genomes-with-the-gtdb'
      },
      {text: 'What is the GTDB versioning scheme?', ref: 'what-is-the-gtdb-versioning-scheme'},
      {
        text: 'Why has the suffix of phyla names been changed to -ota?',
        ref: 'why-has-the-suffix-of-phyla-names-been-changed-to--ota'
      },
      {
        text: 'Why are some genus names formed from a strain identifier?',
        ref: 'why-are-some-genus-names-formed-from-a-strain-identifier'
      },
      {
        text: 'Why do some genus and species names end with an alphabetic suffix?',
        ref: 'why-do-some-genus-and-species-names-end-with-an-alphabetic-suffix'
      },
      {
        text: 'Why do some family and higher rank names end with an alphabetic suffix?',
        ref: 'why-do-some-family-and-higher-rank-names-end-with-an-alphabetic-suffix'
      },
      {
        text: 'What criteria are used to select genomes for inclusion in the GTDB?',
        ref: 'what-criteria-are-used-to-select-genomes-for-inclusion-in-the-gtdb'
      },
      {
        text: 'How are the bacterial and archaeal multiple sequence alignments constructed?',
        ref: 'how-are-the-bacterial-and-archaeal-multiple-sequence-alignments-constructed'
      },
      {
        text: 'How are the bacterial and archaeal reference trees inferred?',
        ref: 'how-are-the-bacterial-and-archaeal-reference-trees-inferred'
      },
      {text: 'How are GTDB species clusters formed?', ref: 'how-are-gtdb-species-clusters-formed'},
      {text: 'How are placeholder genus names formed?', ref: 'how-are-placeholder-genus-names-formed'},
      {
        text: 'How is the specific name of novel GTDB species clusters formed?',
        ref: 'how-is-the-specific-name-of-novel-gtdb-species-clusters-formed'
      },
      {
        text: 'How are the number of taxa at each rank counted?',
        ref: 'how-are-the-number-of-taxa-at-each-rank-counted'
      },
      {
        text: 'How are GTDB species representatives updated with each release?',
        ref: 'how-are-gtdb-species-representatives-updated-with-each-release'
      },
      {
        text: 'How are the names of GTDB species clusters updated with each release?',
        ref: 'how-are-the-names-of-gtdb-species-clusters-updated-with-each-release'
      },
      {
        text: 'Why has the priority rule been violated for a number of selected taxa that were merged in GTDB?',
        ref: 'why-has-the-priority-rule-been-violated-for-a-number-of-selected-taxa-that-were-merged-in-gtdb'
      },
      {
        text: 'What nomenclatural resources does the GTDB use for determining validly published names?',
        ref: 'what-nomenclatural-resources-does-the-gtdb-use-for-determining-validly-published-names'
      },
      {
        text: 'Where can I find details on the methods used by the GTDB?',
        ref: 'where-can-i-find-details-on-the-methods-used-by-the-gtdb'
      },
      {
        text: "Why doesn't the GTDB contain Shigella species?",
        ref: 'why-doesnt-the-gtdb-contain-shigella-species'
      },
      {
        text: "Why do some published phylum (and other higher rank) names not appear in the GTDB taxonomy?",
        ref: 'why-do-some-names-not-appear-in-the-gtdb-taxonomy'
      },
      {text: 'References', ref: 'references'},
    ]
  }),
})
</script>

<style scoped>


</style>
