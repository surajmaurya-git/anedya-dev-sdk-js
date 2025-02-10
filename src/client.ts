import { NewConfig } from "./config";
import { fetchNodeList } from "./NodeManagement/getNodeList";

interface IApiConfig {
  baseUrl: string;
}
export interface IClient {}

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

  // async getNodeList(
  //   limit: number,
  //   offset: number,
  //   order: string
  // ): Promise<any> {
  //   return await fetchNodeList(this.baseUrl, this.apiKey, limit, offset, order);
  // }
}
