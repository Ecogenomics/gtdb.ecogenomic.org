import axios from "axios";
import {RqJobStatus} from "~/assets/api/models";

const apiBase = process.env.apiBase;
const apiTimeout = parseInt(process.env.apiTimeout || '30000');
const apiCacheKey = process.env.apiCacheKey;

// --------------------------------------------------------------------------------------------
// VIEW
// --------------------------------------------------------------------------------------------

export class FastAniApi {

  newJob(payload: FastAniJobRequest) {
    return axios.post<FastAniJobResult>(`${apiBase}/fastani`, payload,
      {
        timeout: apiTimeout,
        params: {cacheKey: apiCacheKey}
      })
  }

  getJob(jobId: number) {
    return axios.get<FastAniJobResult>(`${apiBase}/fastani/${jobId}`,
      {
        timeout: 60000,
        params: {cacheKey: apiCacheKey}
      })
  }

  getJobInfo(jobId: number) {
    return axios.get<FastAniJobInfo>(`${apiBase}/fastani/${jobId}/info`,
      {
        timeout: 60000,
        params: {cacheKey: apiCacheKey},
        validateStatus: function(status) {
              return status < 500;
        }
      })
  }

  getJobHeatmap(jobId: number, method: string) {
    return axios.get<FastAniJobHeatmap>(`${apiBase}/fastani/${jobId}/heatmap/${method}`,
      {
        timeout: 60000,
        params: {cacheKey: apiCacheKey}
      })
  }

  getJobCsvUrl(jobId: number) {
    return `${apiBase}/fastani/${jobId}/csv?cacheKey=${apiCacheKey}`
  }

  getConfig() {
    return axios.get<FastAniConfig>(`${apiBase}/fastani/config`,
      {
        timeout: apiTimeout,
        params: {cacheKey: apiCacheKey}
      })
  }

  validateGenomes(payload: FastAniGenomeValidationRequest) {
    return axios.post<FastAniGenomeValidationResponse[]>(`${apiBase}/fastani/validate/genomes`, payload,
      {
        timeout: apiTimeout,
        params: {cacheKey: apiCacheKey}
      })
  }


  getFastAniJobMetadata(jobId: number) {
    return axios.get<FastAniJobMetadata>(`${apiBase}/fastani/${jobId}/metadata`,
      {
        timeout: apiTimeout,
        params: {cacheKey: apiCacheKey}
      })
  }

}

// --------------------------------------------------------------------------------------------
// MODEL
// --------------------------------------------------------------------------------------------

export interface FastAniJobRequest {
  query: string[],
  reference: string[],
  parameters: FastAniParameters
  priority: string
  email?: string | null
}

export interface FastAniParameters {
  kmer: number,
  frag_len: number,
  min_frag: number,
  min_frac: number,
  version: string
}

export interface FastAniJobResult {
  job_id: number,
  group_1: string[],
  group_2: string[],
  parameters: FastAniParameters,
  results: FastAniResult[],
  positionInQueue: number | null,
}

export interface FastAniResultData {
  status: RqJobStatus,
  ani: number,
  af: number | null,
  mapped: number,
  total: number
  stdout: string | null,
  stderr: string | null,
  cmd: string | null,
}

export interface FastAniResult {
  query: string,
  reference: string,
  data: FastAniResultData,
}

export interface FastAniConfig {
  maxPairwise: number
}

export enum FastAniHeatmapDataStatus {
  QUEUED = "queued",
  FINISHED = "finished",
  ERROR = "error"
}

export interface FastAniJobHeatmapData {
  x: number,
  y: number,
  ani: number,
  af: number,
  status: FastAniHeatmapDataStatus,
}

export interface FastAniJobHeatmap {
  data: FastAniJobHeatmapData[],
  xLabels: string[],
  yLabels: string[],
  xSpecies: string[],
  ySpecies: string[],
  method: string,
  spReps: string[],
  pctDone: number,
}

export enum FastAniJobStatus {
  QUEUED = "queued",
  RUNNING = "running",
  FINISHED = "finished",
  ERROR = "error"
}

export interface FastAniJobInfo {
  jobId: number,
  createdOn: number,
  status: FastAniJobStatus,
}

export interface FastAniGenomeValidationRequest {
  genomes: string[]
}

export interface FastAniGenomeValidationResponse {
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

export interface FastAniJobMetadata {
  query: FastAniGenomeValidationResponse[]
  reference: FastAniGenomeValidationResponse[]
  parameters: FastAniParameters
}
