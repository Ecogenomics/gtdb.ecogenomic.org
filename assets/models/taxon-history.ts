
// All releases available in the taxon history
export enum TaxonHistoryRelease {
  R80 = "80",
  R83 = "83",
  R862 = "86.2",
  R89 = "89",
  R95 = "95",
  R202 = "202",
  R207 = "207",
  NCBI = "NCBI"
}

// The order of the taxon history releases
export const TaxonHistoryReleases = [
  TaxonHistoryRelease.R80,
  TaxonHistoryRelease.R83,
  TaxonHistoryRelease.R862,
  TaxonHistoryRelease.R89,
  TaxonHistoryRelease.R95,
  TaxonHistoryRelease.R202,
  TaxonHistoryRelease.R207,
  TaxonHistoryRelease.NCBI
]

// The search model
export interface TaxonHistorySearch {
  from: TaxonHistoryRelease
  to: TaxonHistoryRelease
  taxon: string
}

// The taxon history sankey model
export interface TaxonHistorySankeyModel {
  filterToRank: string
}
