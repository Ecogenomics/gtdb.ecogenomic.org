// Generic dict interface
import {FastAniParameters} from "~/assets/api/fastani";

export interface Dict<T> {
  [Key: string]: T;
}

// Menu item interface
export interface MenuItem {
  icon: String,
  title: String,
  to: String
  nuxt?: boolean,
  external: boolean
}


// Sectioned page props interface
export interface SectionedPageItems {
  text: string,
  ref: string
}


// Returned by the FastAniQuery.vue component
export interface FastAniQueryPayload {
  query: string[],
  reference: string[],
  priority: string
  email?: string | null
}

