import { NewConfig } from "./config";

export interface IClient {
  tokenId: string;
  tokenBytes: Uint8Array;
  signatureVersionBytes: Uint8Array;
  signatureVersion: string;
  authorizationMode: string;
  baseUrl: string;
}

export class NewClient implements IClient {
  tokenId: string;
  tokenBytes: Uint8Array;
  signatureVersionBytes: Uint8Array;
  signatureVersion: string = "v1";
  authorizationMode: string = "ANEDYASIGV1";

  baseUrl: string;

  constructor(config: NewConfig) {
    const { token, tokenId } = config;
    this.tokenId = tokenId;
    this.signatureVersionBytes = new TextEncoder().encode(this.signatureVersion);
    this.tokenBytes = new TextEncoder().encode(token);
    this.baseUrl = config.baseUrl;
  }
}
