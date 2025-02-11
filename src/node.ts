import { fetchData,fetchLatestData } from "./services/accessData";
import { _IAnedya_GetData_Req, _IAnedya_GetLatestData_Req } from "./models";
import { NewClient } from "./client";
import { IConfigHeaders } from "./common_i";

export interface INode {
  getNodeId(): string;
  getData(accessDataReq: _IAnedya_GetData_Req): Promise<any>;
}

export class NewNode implements INode {
  #nodeId: string; // Define as a private field with #
  #baseUrl: string;
  #configHeaders: IConfigHeaders;

  constructor(client: NewClient, nodeId: string) {
    const { baseUrl, tokenId, tokenBytes, signatureVersionBytes, signatureVersion, authorizationMode } = client;
    this.#nodeId = nodeId; // Assign using #
    this.#baseUrl = baseUrl;
    this.#configHeaders = {
      tokenId,
      tokenBytes,
      signatureVersion,
      signatureVersionBytes,
      authorizationMode,
    };
  }

  getNodeId(): string {
    return this.#nodeId;
  }

  async getData(accessDataReq: _IAnedya_GetData_Req): Promise<any> {
    return await fetchData(
      this.#baseUrl,
      this.#configHeaders,
      [this.#nodeId],
      accessDataReq
    );
  }
  async getlatestData(variableIdentifier:string) {
    const accessDataReq={
      variable:variableIdentifier
    }
    return await fetchLatestData(
      this.#baseUrl,
      this.#configHeaders,
      [this.#nodeId],
      accessDataReq
    );
  }

}
