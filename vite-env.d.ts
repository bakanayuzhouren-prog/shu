declare namespace NodeJS {
  interface ProcessEnv {
    readonly API_KEY: string;
  }
}

// Fix: Define ImportMetaEnv interface to resolve "Cannot find name 'ImportMetaEnv'" error
interface ImportMetaEnv {
  readonly API_KEY: string;
  [key: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}