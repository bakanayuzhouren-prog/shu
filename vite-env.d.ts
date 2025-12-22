
declare namespace NodeJS {
  interface ProcessEnv {
    readonly API_KEY: string;
  }
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
