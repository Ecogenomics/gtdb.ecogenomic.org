import axios from "axios";

const apiBase = process.env.apiBase;
const apiTimeout = parseInt(process.env.apiTimeout || '30000');
const apiCacheKey = process.env.apiCacheKey;

// --------------------------------------------------------------------------------------------
// VIEW
// --------------------------------------------------------------------------------------------

export class MetaApi {

  version() {
    return axios.get<MetaVersionResponse>(`${apiBase}/meta/version`,
      {
        timeout: apiTimeout,
        params: {cacheKey: apiCacheKey}
      })
  }

}

// --------------------------------------------------------------------------------------------
// MODEL
// --------------------------------------------------------------------------------------------

export interface MetaVersionResponse {
  major: string,
  minor: string,
  patch: string,
}
