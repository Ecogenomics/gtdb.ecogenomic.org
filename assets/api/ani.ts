import axios from "axios";

const apiBase = process.env.apiBase;
const apiTimeout = parseInt(process.env.apiTimeout || '30000');
const apiCacheKey = process.env.apiCacheKey || 1;

// --------------------------------------------------------------------------------------------
// VIEW
// --------------------------------------------------------------------------------------------

export class AniApi {
  getAniPrograms() {
    return axios.get<AniProgram[]>(`${apiBase}/ani/programs`,
      {
        timeout: apiTimeout,
        params: {cacheKey: apiCacheKey}
      })
  }

  validateGenomes(payload: AniGenomeValidationRequest) {
    return axios.post<AniGenomeValidationResponse[]>(`${apiBase}/ani/validate/genomes`, payload,
      {
        timeout: apiTimeout,
        params: {cacheKey: apiCacheKey}
      })
  }

  createNewJob(payload: AniJobRequest) {
    // Depending on if files are included, we may need to use multipart/form-data
    if (payload.userGenomes != null && payload.userGenomes.files.length > 0) {
      const formData = new FormData();
      formData.append('payload', JSON.stringify(payload));
      for (let i = 0; i < payload.userGenomes.files.length; i++) {
        formData.append('files', payload.userGenomes.files[i]);
      }
      return axios.put<AniCreateJobResponse>(`${apiBase}/ani/job`, formData,
        {
          timeout: apiTimeout,
          params: {cacheKey: apiCacheKey},
          headers: {'Content-Type': 'multipart/form-data'}
        })
    } else {
      // No files, just send the payload as JSON
      return axios.post<AniCreateJobResponse>(`${apiBase}/ani/job`, payload,
        {
          timeout: apiTimeout,
          params: {cacheKey: apiCacheKey},
        })
    }
  }

  getJob(jobId: string) {
    return axios.get<AniJobResultResponseIndex>(`${apiBase}/ani/${jobId}`,
      {
        timeout: apiTimeout,
        params: {cacheKey: apiCacheKey}
      })
  }

  getConfig() {
    return axios.get<AniConfigResponse>(`${apiBase}/ani/config`,
      {
        timeout: apiTimeout,
        params: {cacheKey: apiCacheKey}
      })
  }

}


export enum AniProgramEnum {
  SKANI_0_3_0 = "skani-0.3.0",
  FASTANI_1_33 = "FastANI-1.33",
  FASTANI_1_32 = "FastANI-1.32",
  FASTANI_1_31 = "FastANI-1.31",
  FASTANI_1_3 = "FastANI-1.3",
  FASTANI_1_2 = "FastANI-1.2",
  FASTANI_1_1 = "FastANI-1.1",
  FASTANI_1_0 = "FastANI-1.0"
}

export function convertAniProgramStringToEnum(value: string): AniProgramEnum | null {
  if (value == AniProgramEnum.SKANI_0_3_0) {
    return AniProgramEnum.SKANI_0_3_0;
  } else if (value == AniProgramEnum.FASTANI_1_33) {
    return AniProgramEnum.FASTANI_1_33;
  } else if (value == AniProgramEnum.FASTANI_1_32) {
    return AniProgramEnum.FASTANI_1_32;
  } else if (value == AniProgramEnum.FASTANI_1_31) {
    return AniProgramEnum.FASTANI_1_31;
  } else if (value == AniProgramEnum.FASTANI_1_3) {
    return AniProgramEnum.FASTANI_1_3;
  } else if (value == AniProgramEnum.FASTANI_1_2) {
    return AniProgramEnum.FASTANI_1_2;
  } else if (value == AniProgramEnum.FASTANI_1_1) {
    return AniProgramEnum.FASTANI_1_1;
  } else if (value == AniProgramEnum.FASTANI_1_0) {
    return AniProgramEnum.FASTANI_1_0;
  }
  return null;
}

export enum SkaniParametersPresetEnum {
  FAST = "fast",
  MEDIUM = "medium",
  SLOW = "slow",
  SMALL_GENOMES = "small-genomes"
}

export function convertStringToSkaniParametersPresetEnum(value: string | null) {
  if (value === "fast") {
    return SkaniParametersPresetEnum.FAST
  } else if (value === "medium") {
    return SkaniParametersPresetEnum.MEDIUM
  } else if (value === "slow") {
    return SkaniParametersPresetEnum.SLOW
  } else if (value === "small-genomes") {
    return SkaniParametersPresetEnum.SMALL_GENOMES
  } else {
    return null;
  }
}


export const AniProgramSkani = [AniProgramEnum.SKANI_0_3_0];

export const AniProgramFastAni = [AniProgramEnum.FASTANI_1_33, AniProgramEnum.FASTANI_1_32, AniProgramEnum.FASTANI_1_31,
  AniProgramEnum.FASTANI_1_3, AniProgramEnum.FASTANI_1_2, AniProgramEnum.FASTANI_1_1, AniProgramEnum.FASTANI_1_0];

export interface AniProgram {
  name: string,
  version: string,
}


export function convertAniProgramToEnum(value: AniProgram): AniProgramEnum {
  if (value.name === "skani" && value.version === "0.3.0") {
    return AniProgramEnum.SKANI_0_3_0;
  } else if (value.name === "FastANI" && value.version === "1.33") {
    return AniProgramEnum.FASTANI_1_33;
  } else if (value.name === "FastANI" && value.version === "1.32") {
    return AniProgramEnum.FASTANI_1_32;
  } else if (value.name === "FastANI" && value.version === "1.31") {
    return AniProgramEnum.FASTANI_1_31;
  } else if (value.name === "FastANI" && value.version === "1.3") {
    return AniProgramEnum.FASTANI_1_3;
  } else if (value.name === "FastANI" && value.version === "1.2") {
    return AniProgramEnum.FASTANI_1_2;
  } else if (value.name === "FastANI" && value.version === "1.1") {
    return AniProgramEnum.FASTANI_1_1;
  } else if (value.name === "FastANI" && value.version === "1.0") {
    return AniProgramEnum.FASTANI_1_0;
  } else {
    return AniProgramEnum.SKANI_0_3_0;
  }
}

export function convertAniEnumToAniProgram(value: AniProgramEnum): AniProgram {
  if (value === AniProgramEnum.SKANI_0_3_0) {
    return {
      name: "skani",
      version: "0.3.0"
    };
  } else if (value === AniProgramEnum.FASTANI_1_33) {
    return {
      name: "FastANI",
      version: "1.33"
    };
  } else if (value === AniProgramEnum.FASTANI_1_32) {
    return {
      name: "FastANI",
      version: "1.32"
    };
  } else if (value === AniProgramEnum.FASTANI_1_31) {
    return {
      name: "FastANI",
      version: "1.31"
    };
  } else if (value === AniProgramEnum.FASTANI_1_3) {
    return {
      name: "FastANI",
      version: "1.3"
    };
  } else if (value === AniProgramEnum.FASTANI_1_2) {
    return {
      name: "FastANI",
      version: "1.2"
    };
  } else if (value === AniProgramEnum.FASTANI_1_1) {
    return {
      name: "FastANI",
      version: "1.1"
    };
  } else if (value === AniProgramEnum.FASTANI_1_0) {
    return {
      name: "FastANI",
      version: "1.0"
    };
  } else {
    return {
      name: "skani",
      version: "0.3.0"
    };
  }
}

export interface AniParametersSkaniJson {
  skaniMinAf: number | null,
  skaniBothMinAf: number | null,
  skaniPreset: SkaniParametersPresetEnum | null,
  skaniCFactor: number | null,
  skaniFasterSmall: boolean | null,
  skaniMFactor: number | null,
  skaniUseMedian: boolean | null,
  skaniNoLearnedAni: boolean | null,
  skaniNoMarkerIndex: boolean | null,
  skaniRobust: boolean | null,
  skaniScreen: number | null,
  skaniDetailed: boolean | null
}

export interface AniParametersFastAniJson {
  fastAniKmer: number | null,
  fastAniFragLen: number | null,
  fastAniMinFrag: number | null,
  fastAniMinFrac: number | null,
}


export interface AniJobRequest {
  query: string[],
  reference: string[],
  paramsFastAni?: AniParametersFastAniJson,
  paramsSkani?: AniParametersSkaniJson
  program: AniProgram,
  userGenomes: AniUploadedGenomeRequest | null
  email: string | null,
}

export interface AniJobResultResponse {
  jobId: number,
  query: string[],
  reference: string[],
  paramsFastAni?: AniParametersFastAniJson,
  paramsSkani?: AniParametersSkaniJson
  program: AniProgram,
  results: AniResult[]
}

export interface AniJobResultResponseIndex {
  jobId: number,
  query: AniGenomeValidationResponse[],
  reference: AniGenomeValidationResponse[],
  paramsFastAni?: AniParametersFastAniJson,
  paramsSkani?: AniParametersSkaniJson
  program: AniProgram,
}


// export interface AniUploadedGenomeFile {
//   name: string,
//   content: string
// }

export interface AniUploadedGenomeRequest {
  files: File[],
  deleteAfter: string,
}

// The row used when displaying the genomes selected for query / reference
export interface AniQueryRow {
  name: string,
  isUser: boolean | null,
  isRep: boolean | null,
  domain: string | null,
  phylum: string | null,
  class: string | null,
  order: string | null,
  family: string | null,
  genus: string | null,
  species: string | null
}


export interface AniCreateJobResponse {
  jobId: string,
}

export interface AniGenomeValidationResponse {
  accession: string,
  isSpRep: boolean | null,
  gtdbDomain: string | null,
  gtdbPhylum: string | null,
  gtdbClass: string | null,
  gtdbOrder: string | null,
  gtdbFamily: string | null,
  gtdbGenus: string | null,
  gtdbSpecies: string | null,
}


export interface AniGenomeValidationRequest {
  genomes: string[]
}


// OLD BELOW


export interface AniResult {
  query: string,
  reference: string,
  ani: number | null,
  af: number | null,
  data: Object
}


export enum AniTableResultStatus {
  RUNNING = "RUNNING",
  QUEUED = "QUEUED",
  ERROR = "ERROR"
}

export interface AniTableResultRow {
  query: string,
  reference: string,
  ani: number | null,
  af: number | null,
  status: AniTableResultStatus,

  fastAniMappedFrags?: number | null,
  fastAniTotalFrags?: number | null,

  skaniNumRefContigs?: number | null,
  skaniNumQryContigs?: number | null,
  skaniAni5Percentile?: number | null,
  skaniAni95Percentile?: number | null,
  skaniStdDev?: number | null,
  skaniRef90CtgLen?: number | null,
  skaniRef50CtgLen?: number | null,
  skaniRef10CtgLen?: number | null,
  skaniQry90CtgLen?: number | null,
  skaniQry50CtgLen?: number | null,
  skaniQry10CtgLen?: number | null,
  skaniAvgChainLen?: number | null,
  skaniTotalBasesCovered?: number | null,
}

export interface AniTableResult {
  program: AniProgramEnum,
  rows: AniTableResultRow[],


}

export interface AniConfigResponse {
  maxPairwise: number,
  maxUserFileSizeMbEach: number,
  maxUserFileNameLength: number,
  maxUserFileCount: number,
  supportedPrograms: AniProgram[]
}
