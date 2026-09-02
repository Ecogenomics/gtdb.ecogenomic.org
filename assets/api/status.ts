import axios from "axios";

const apiBase = process.env.apiBase;
const apiTimeout = parseInt(process.env.apiTimeout || '30000');

// --------------------------------------------------------------------------------------------
// VIEW
// --------------------------------------------------------------------------------------------

export class StatusApi {

  db() {
    return axios.get<StatusDbResponse>(`${apiBase}/status/db`,
      {
        timeout: 10000,
      })
  }

}

// --------------------------------------------------------------------------------------------
// MODEL
// --------------------------------------------------------------------------------------------

export interface StatusDbResponse {
  timeMs: number,
  online: boolean,
}
