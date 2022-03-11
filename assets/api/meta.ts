import axios from "axios";

const apiBase = process.env.apiBase;
const apiTimeout = parseInt(process.env.apiTimeout || '30000');


// --------------------------------------------------------------------------------------------
// VIEW
// --------------------------------------------------------------------------------------------

export class MetaApi {

  version() {
    return axios.get<MetaVersionResponse>(`${apiBase}/meta/version`, {timeout: apiTimeout})
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
