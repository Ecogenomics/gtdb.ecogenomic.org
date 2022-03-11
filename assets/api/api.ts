import axios, {AxiosError} from "axios"
import {FastApiValidationError} from "~/assets/api/models";
import {TaxonomyApi} from "~/assets/api/taxonomy";
import {FastAniApi} from "~/assets/api/fastani";
import {SpeciesApi} from "~/assets/api/species";
import {GenomeApi} from "~/assets/api/genome";
import {SankeyApi} from "~/assets/api/sankey";
import {SearchApi} from "~/assets/api/search";
import {TaxonApi} from "~/assets/api/taxon";
import {AdvancedApi} from "~/assets/api/advanced";
import {UtilApi} from "~/assets/api/util";
import {MetaApi} from "~/assets/api/meta";

export class API {
  fastani = new FastAniApi();
  genome = new GenomeApi();
  sankey = new SankeyApi();
  search = new SearchApi();
  species = new SpeciesApi();
  taxon = new TaxonApi();
  taxonomy = new TaxonomyApi();
  advanced = new AdvancedApi();
  util = new UtilApi();
  meta = new MetaApi();
}

export function getApiErrorMessage(error: Error | AxiosError): string[] {
  if (axios.isAxiosError(error)) {
    if (error.response && error.response.data && error.response.data.detail) {

      // Validation error
      if (error.response.status === 422) {
        const out = [];
        const msg: FastApiValidationError[] = error.response.data.detail;
        for (let i = 0; i < msg.length; i++) {
          const curMsg = msg[i];
          out.push(`${curMsg.loc[curMsg.loc.length - 1]}: ${curMsg.msg}`)
        }
        return out;
      }

      return [error.response.data.detail];

    } else {
      return [error.message];
    }
  } else {
    return [error.message];
  }
}
