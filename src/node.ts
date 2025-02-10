import { fetchLatestData } from "./DataAccess/fetchLatestData";
import { fetchData } from "./DataAccess/fetchData";
import { fetchSnapshot } from "./DataAccess/fetchSnapshot";
import { sendCommand } from "./Commands/commands";
import { Anedya_AccessData, Anedya_AccessLatestData, Command } from "./models";
import { NewClient } from "./client";
import { IConfigHeaders } from "./interface";

export interface INode {
  getNodeId(): string;
  getData(accessDataReq: Anedya_AccessData): Promise<any>;
  getLatestData(variable: string): Promise<any>;
  getSnapshot(variable: string, timestamp_sec: number): Promise<any>;
  sendCommand(command: Command): Promise<any>;
}

export class NewNode {
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

  async getData(accessDataReq: Anedya_AccessData): Promise<any> {
    return await fetchData(
      this.#baseUrl,
      this.#configHeaders,
      [this.#nodeId],
      accessDataReq
    );
  }
  async getLatestData(variable: string): Promise<any> {}

  // async getLatestData(variable: string): Promise<any> {
  //   if (this.apiKey.trim() === "") {
  //     throw new Error("No API key provided");
  //   }
  //   return await fetchLatestData(this.baseUrl, this.apiKey, [this.nodeId], variable);
  // }
  // async getSnapshot(variable: string, timestamp_sec: number): Promise<any> {
  //   if (this.apiKey.trim() === "") {
  //     throw new Error("No API key provided");
  //   }
  //   return await fetchSnapshot(this.baseUrl, this.apiKey,[this.nodeId], variable, timestamp_sec);
  // }
  // async sendCommand(command: Command): Promise<any> {
  //   if (this.apiKey.trim() === "") {
  //     throw new Error("No API key provided");
  //   }
  //   return await sendCommand(this.baseUrl, this.apiKey, this.nodeId,command);
  // }
}
