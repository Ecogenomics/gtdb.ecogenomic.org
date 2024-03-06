

// The row used when displaying the genomes selected for query / reference
export interface FastAniQueryRow {
  name: string,
  isRep: boolean | null,
  domain: string | null,
  phylum: string | null,
  class: string | null,
  order: string | null,
  family: string | null,
  genus: string | null,
  species: string | null
}

export enum FastAniInputGroup {
  query,
  reference,
  both
}

export interface FastAniAddGenomesFromUserInput {
  genomes: FastAniQueryRow[],
  group: FastAniInputGroup
}
