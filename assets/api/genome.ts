import axios from "axios";

const apiBase = process.env.apiBase;
const apiTimeout = parseInt(process.env.apiTimeout || '30000');
const apiCacheKey = process.env.apiCacheKey;

// --------------------------------------------------------------------------------------------
// VIEW
// --------------------------------------------------------------------------------------------

export class GenomeApi {

  getMetadata(accession: string) {
    return axios.get<GenomeMetadata>(`${apiBase}/genome/${encodeURIComponent(accession)}/metadata`,
      {
        timeout: apiTimeout,
        params: {cacheKey: apiCacheKey}
      })
  }

  getTaxonHistory(accession: string) {
    return axios.get<GenomeTaxonHistory[]>(`${apiBase}/genome/${encodeURIComponent(accession)}/taxon-history`,
      {
        timeout: apiTimeout,
        params: {cacheKey: apiCacheKey}
      })
  }


  getCard(accession: string) {
    return axios.get<GenomeCard>(`${apiBase}/genome/${encodeURIComponent(accession)}/card`,
      {
        timeout: apiTimeout,
        params: {cacheKey: apiCacheKey}
      })
  }

}

// --------------------------------------------------------------------------------------------
// MODEL
// --------------------------------------------------------------------------------------------

export interface GenomeMetadata {
  accession: string
  isNcbiSurveillance: boolean
}

export interface GenomeMetadataTypeMaterial {
  gtdbTypeDesignation?: string
  gtdbTypeDesignationSources?: string
  lpsnTypeDesignation?: string
  dsmzTypeDesignation?: string
  lpsnPriorityYear?: number
  gtdbTypeSpeciesOfGenus?: boolean
}

export interface GenomeTaxonHistory {
  release: string
  d: string
  p: string
  c: string
  o: string
  f: string
  g: string
  s: string
}


export interface GenomeBase {
  accession: string,
  name: string
}

export interface GenomeMetadataTaxonomy {
  gtdbDomain: string
  gtdbPhylum: string
  gtdbClass: string
  gtdbOrder: string
  gtdbFamily: string
  gtdbGenus: string
  gtdbSpecies: string
  gtdb_representative: boolean
  gtdb_genome_representative: string

}

export interface GenomeNcbiTaxon {
  taxon: string
  taxonId?: string
}

export interface GenomeMetadataGene {
  checkm_completeness: number
  checkm_contamination: number
  checkm_strain_heterogeneity: number
  lsu_5s_count: number
  ssu_count: number
  lsu_23s_count: number
  protein_count: number
  coding_density: number

}

export interface GenomeMetadataNucleotide {
  trna_aa_count: number
  contig_count: number
  n50_contigs: number
  longest_contig: number
  scaffold_count: number
  n50_scaffolds: number
  longest_scaffold: number
  genome_size: number
  gc_percentage: number
  ambiguous_bases: number

}

export interface GenomeMetadataNcbi {
  ncbi_strain_identifiers?: string
  ncbi_assembly_level: string
  ncbi_assembly_name: string
  ncbi_assembly_type: string
  ncbi_bioproject: string
  ncbi_biosample: string
  ncbi_country: string
  ncbi_date: string
  ncbi_genbank_assembly_accession: string
  ncbi_genome_category: string
  ncbi_genome_representation: string
  ncbi_isolate: string
  ncbi_isolation_source: string
  ncbi_lat_lon: string
  ncbi_molecule_count: number
  ncbi_cds_count: number
  ncbi_refseq_category: string
  ncbi_seq_rel_date: string
  ncbi_spanned_gaps: string
  ncbi_species_taxid: number
  ncbi_ssu_count: number
  ncbi_submitter: string
  ncbi_taxid: number
  ncbi_total_gap_length: number
  ncbi_translation_table: number
  ncbi_trna_count: number
  ncbi_type_material_designation: string
  ncbi_unspanned_gaps: number
  ncbi_version_status: string
  ncbi_wgs_master: string
}


export interface GenomeCard {
  genome: GenomeBase
  speciesRepName?: string
  metadataTaxonomy: GenomeMetadataTaxonomy
  metadata_type_material?: GenomeMetadataTypeMaterial
  lpsnUrl?: string
  ncbiTaxonomyFiltered: GenomeNcbiTaxon[]
  ncbiTaxonomyUnfiltered: GenomeNcbiTaxon[]
  metadata_ncbi: GenomeMetadataNcbi
  gtdbTypeDesignation?: string
  metadata_gene: GenomeMetadataGene
  metadata_nucleotide: GenomeMetadataNucleotide
  speciesClusterCount?: number
  subunit_summary?: string
}

