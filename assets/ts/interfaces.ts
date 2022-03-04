// Generic dict interface
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
