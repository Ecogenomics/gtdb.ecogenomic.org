import axios from "axios";

const apiBase = process.env.apiBase;
const apiTimeout = parseInt(process.env.apiTimeout || '30000');
const apiCacheKey = process.env.apiCacheKey;

// --------------------------------------------------------------------------------------------
// VIEW
// --------------------------------------------------------------------------------------------

export class GenomesApi {

  areGenomesDownloaded(payload: AreGenomesDownloadedRequest) {
    return axios.post<AreGenomesDownloadedResponse>(`${apiBase}/genomes/are-downloaded`,
      payload,
      {
        timeout: apiTimeout,
        params: {cacheKey: apiCacheKey}
      })
  }



}

// --------------------------------------------------------------------------------------------
// MODEL
// --------------------------------------------------------------------------------------------

export interface AreGenomesDownloadedRequest {
  genomes: string[]
}

export interface AreGenomesDownloadedItem {
  gid: string,
  downloaded: boolean
}

export interface AreGenomesDownloadedResponse {
  genomes: AreGenomesDownloadedItem[]
}
