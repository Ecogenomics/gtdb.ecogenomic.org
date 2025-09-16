import axios from "axios";

const apiBase = process.env.apiBase;
const apiTimeout = parseInt(process.env.apiTimeout || '30000');
const apiCacheKey = process.env.apiCacheKey;

// --------------------------------------------------------------------------------------------
// VIEW
// --------------------------------------------------------------------------------------------

export class SkaniApi {

    getConfig() {
        return axios.get<SkaniServerConfig>(`${apiBase}/skani/config`,
            {
                timeout: apiTimeout,
                params: {cacheKey: apiCacheKey}
            })
    }

    createJob(payload: SkaniJobRequest, uploadedFiles: File[] | null, fileMetadata: SkaniJobUploadMetadata | null) {
        // Depending on if files are included, we may need to use multipart/form-data
        if (uploadedFiles != null && uploadedFiles.length > 0) {
            const formData = new FormData();
            formData.append('payload', JSON.stringify(payload));
            formData.append('uploadMetadata', JSON.stringify(fileMetadata));
            for (let i = 0; i < uploadedFiles.length; i++) {
                formData.append('files', uploadedFiles[i]);
            }
            return axios.put<SkaniCreatedJobResponse>(`${apiBase}/skani/job`, formData,
                {
                    timeout: apiTimeout,
                    params: {cacheKey: apiCacheKey},
                    headers: {'Content-Type': 'multipart/form-data'}
                })
        } else {
            // No files, just send the payload as JSON
            return axios.post<SkaniCreatedJobResponse>(`${apiBase}/skani/job`, payload,
                {
                    timeout: apiTimeout,
                    params: {cacheKey: apiCacheKey},
                })
        }
    }

    validateGenomes(payload: SkaniValidateGenomesRequest) {
        return axios.post<SkaniValidateGenomesResponse[]>(`${apiBase}/skani/validate/genomes`, payload,
            {
                timeout: apiTimeout,
                params: {cacheKey: apiCacheKey}
            })
    }

    getJobQueryPage(jobId: string) {
        return axios.get<SkaniJobDataIndexResponse>(`${apiBase}/skani/job/${jobId}/query`,
            {
                timeout: apiTimeout,
                params: {cacheKey: apiCacheKey}
            })
    }

    getJobStatusPage(jobId: string) {
        return axios.get<SkaniJobStatusResponse>(`${apiBase}/skani/job/${jobId}/status`,
            {
                timeout: apiTimeout,
                params: {cacheKey: apiCacheKey}
            })
    }

    getJobTablePage(jobId: string, showNa: boolean) {
        return axios.get<SkaniJobDataTableResponse>(`${apiBase}/skani/job/${jobId}/table`,
            {
                timeout: apiTimeout,
                params: {
                  cacheKey: apiCacheKey,
                    showNa: showNa ? 'true' : 'false'
                }
            })
    }

  getJobHeatmap(jobId: string, clusterBy: string) {
    return axios.get<SkaniJobDataHeatmapResponse>(`${apiBase}/skani/job/${jobId}/heatmap`,
      {
        timeout: apiTimeout,
        params: {
          cacheKey: apiCacheKey,
          clusterBy: clusterBy
        }
      })
  }


}

// --------------------------------------------------------------------------------------------
// MODEL
// --------------------------------------------------------------------------------------------

export enum SkaniVersion {
    SKANI_0_3_0 = "0.3.0"
}


export enum SkaniCalculationMode {
    TRIANGLE = "Triangle",
    QVR = "Query vs. Reference"
}


export enum SkaniParametersPreset {
    FAST = "fast",
    MEDIUM = "medium",
    SLOW = "slow",
    SMALL_GENOMES = "small-genomes"
}

export enum SkaniDeleteUserResultsAfter {
    DISABLED = "disabled",
    HOUR_1 = "1_hour",
    DAY_1 = "1_day",
    WEEK_1 = "1_week",
    MONTH_1 = "1_month"
}

export interface SkaniServerConfig {
    maxPairwise: number,
    maxUserFileSizeMbEach: number,
    maxUserFileNameLength: number,
    maxUserFileCount: number,
    supportedPrograms: SkaniVersion[]
    maxQueuePendingJobs: number,
}

export interface SkaniParameters {
    minAf: number | null,
    bothMinAf: number | null,
    skaniPreset: SkaniParametersPreset | null,
    cFactor: number | null,
    fasterSmall: boolean | null,
    mFactor: number | null,
    useMedian: boolean | null,
    noLearnedAni: boolean | null,
    noMarkerIndex: boolean | null,
    robust: boolean | null,
    screen: number | null
}


export interface SkaniJobRequest {
    query: string[],
    reference: string[],
    params: SkaniParameters | null,
    email: string | null,
    calcMode: SkaniCalculationMode,
    version: SkaniVersion
}

export interface SkaniJobUploadMetadata {
    deleteAfter: SkaniDeleteUserResultsAfter | null
}

export interface SkaniCreatedJobResponse {
    jobId: string
}

export interface SkaniValidateGenomesRequest {
    genomes: string[]
}

export interface SkaniValidateGenomesResponse {
    accession: string,
    isUser: boolean | null,
    isSpRep: boolean | null,
    gtdbDomain: string | null,
    gtdbPhylum: string | null,
    gtdbClass: string | null,
    gtdbOrder: string | null,
    gtdbFamily: string | null,
    gtdbGenus: string | null,
    gtdbSpecies: string | null,
}

export interface SkaniJobDataIndexResponse {
    jobId: string,
    mode: SkaniCalculationMode,
    params: SkaniParameters,
    version: SkaniVersion,
    query: SkaniValidateGenomesResponse[],
    reference: SkaniValidateGenomesResponse[]


}

export interface SkaniJobStatusResponse {
    jobId: string,
    createdEpoch: number,
    completedEpoch: number | null,
    error: boolean | null,
    positionInQueue: number | null,
    totalPendingJobs: number | null,
    stdout: string | null,
    stderr: string | null,
    deleteAfter: SkaniDeleteUserResultsAfter | null
}


export interface SkaniResultTableRow {
    id?: number,
    qry: string,
    ref: string,
    ani: number | null,
    afQry: number | null,
    afRef: number | null
}

export interface SkaniJobDataTableResponse {
    jobId: string,
    completed: boolean,
    error: boolean | null,
    rows: SkaniResultTableRow[]

}

export interface SkaniJobHeatmapData {
    x: number,
    y: number,
    ani: number,
    af: number
}

export interface SkaniJobDataHeatmapResponse {
    jobId: string,
    completed: boolean,
    error: boolean | null,
    ani: number[][],
    af: number[][],
    xLabels: string[],
    yLabels: string[],
    xSpecies: string[],
    ySpecies: string[],
    method: string,
    spReps: string[]
}
