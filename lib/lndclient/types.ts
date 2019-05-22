/** The configurable options for the lnd client. */
export type LndClientConfig = {
  disable: boolean;
  certpath: string;
  macaroonpath: string;
  host: string;
  port: number;
  cltvdelta: number;
  nomacaroons: boolean;
};

/** General information about the state of this lnd client. */
export type LndInfo = {
  error?: string;
  channels?: ChannelCount;
  chains?: Chain[];
  blockheight?: number;
  uris?: string[];
  version?: string;
  alias?: string;
};

export type ChannelCount = {
  active: number,
  inactive?: number,
  pending: number,
};

export type Chain = {
  network: string,
  chain: string,
};

export type LndLogger = {
  error: Function,
  warn: Function,
  info: Function,
  verbose: Function,
  debug: Function,
  trace: Function,
};

export type LndPubKeys = { [currency: string]: string | undefined };
export type LndInfos = { [currency: string]: LndInfo | undefined };
