import axios from "axios";

const apiBase = process.env.apiBase;
const apiTimeout = parseInt(process.env.apiTimeout || '30000');
const apiCacheKey = process.env.apiCacheKey;

// --------------------------------------------------------------------------------------------
// VIEW
// --------------------------------------------------------------------------------------------

export class UtilApi {

  sendContactUsEmail(payload: UtilContactEmailRequest) {
    return axios.post(`${apiBase}/util/contact`, payload,
      {
        timeout: apiTimeout,
        params: {cacheKey: apiCacheKey}
      })
  }

  convertTreeAccessions(payload: UtilConvertTreeAccessionsRequest) {
    const formData = new FormData();
    if (payload.newickFile) {
      formData.append('newickFile', payload.newickFile);
    }
    if (payload.newickString) {
      formData.append('newickString', payload.newickString);
    }
    formData.append('noUserAcc', payload.noUserAcc);
    formData.append('prevUser', payload.prevUser);
    formData.append('userOnly', payload.userOnly);

    return axios.post(`${apiBase}/util/convert-tree-accessions`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      responseType: 'blob',
      params: {cacheKey: apiCacheKey}
    })
  }

}

// --------------------------------------------------------------------------------------------
// MODEL
// --------------------------------------------------------------------------------------------

export interface UtilContactEmailRequest {
  fromEmail: string,
  subject: string,
  message: string,
  clientResponse: string
}


export interface UtilConvertTreeAccessionsRequest {
  newickFile?: File
  newickString?: string
  noUserAcc: string
  prevUser: string
  userOnly: string
}


