import axios from "axios";
import {RqJobStatus} from "~/assets/api/models";

const apiBase = process.env.apiBase;
const apiTimeout = parseInt(process.env.apiTimeout || '30000');


// --------------------------------------------------------------------------------------------
// VIEW
// --------------------------------------------------------------------------------------------

export class FastAniApi {

  newJob(payload: FastAniJobRequest) {
    return axios.post<FastAniJobResult>(`${apiBase}/fastani`, payload)
  }

  getJob(jobId: string) {
    return axios.get<FastAniJobResult>(`${apiBase}/fastani/${jobId}`, {timeout: 60000})
  }

  getJobHeatmap(jobId: string, method: string) {
    return axios.get<FastAniJobHeatmap>(`${apiBase}/fastani/${jobId}/heatmap/${method}`, {timeout: 60000})
  }

  getJobCsvUrl(jobId: string) {
    return `${apiBase}/fastani/${jobId}/csv`
  }

  getConfig() {
    return axios.get<FastAniConfig>(`${apiBase}/fastani/config`, {timeout: apiTimeout})
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
}

export interface FastAniParameters {
  kmer: number,
  frag_len: number,
  min_frag: number,
  min_frac: number,
  version: string
}

export interface FastAniJobResult {
  job_id: string,
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
