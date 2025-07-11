/*
 * This module contains the NewNode class which is used to create an instance
 * of a node. A node is a logical entity that can be used to access data from
 * anedya of a particular device.
 *
 */
import { getData, fetchLatestData } from "./services/accessData";
import { setKey, getKey, deleteKey, scanValueStore } from "./services/valueStore";
import {
  _IAnedya_GetData_Req_Obj,
  _IAnedya_GetLatestData_Req_Obj,
  _IAnedya_SetKey_Req_Obj,
  _IAnedya_GetKey_Req_Obj,
  _IAnedya_DeleteKey_Req_Obj,
  _IAnedya_ScanVS_Req_Obj,
} from "./models";
import { NewClient } from "./client";
import { IConfigHeaders } from "./common";

export interface INode {
  getNodeId(): string;
  getDataBetween(accessDataReq: _IAnedya_GetData_Req_Obj): Promise<any>;
}

export class NewNode implements INode {
  #nodeId: string; // Define as a private field with #
  #baseUrl: string;
  #configHeaders: IConfigHeaders;

  constructor(client: NewClient, nodeId: string) {
    const {
      baseUrl,
      tokenId,
      tokenBytes,
      signatureVersionBytes,
      signatureVersion,
      authorizationMode,
    } = client;
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

  /**
   * Returns the node ID of the node.
   * @returns {string} The node ID of the node.
   */
  getNodeId(): string {
    return this.#nodeId;
  }

  /**
   * Fetches data from the node based on the given request.
   * @param {Object} accessDataReq - The request object for fetching data.
   * @param {string} accessDataReq.variable - The variable identifier name to fetch data for.
   * @param {number} accessDataReq.from - The start time of the time range to fetch data from.
   * @param {number} accessDataReq.to - The end time of the time range to fetch data from.
   * @param {number} [accessDataReq.limit=10000] - The maximum number of data points to return.
   * @param {"asc"|"desc"} [accessDataReq.order="desc"] - The order of the data points to return.
   * @returns {Promise<any>} A promise that resolves with the response data.
   */
  async getDataBetween(accessDataReq: _IAnedya_GetData_Req_Obj): Promise<any> {
    return await getData(
      this.#baseUrl,
      this.#configHeaders,
      [this.#nodeId],
      accessDataReq
    );
  }
  /**
   * Fetches the latest data point from the node based on the given variable identifier.
   * @param {string} variableIdentifier - The variable identifier name to fetch the latest data point for.
   * @returns {Promise<any>} A promise that resolves with the response data.
   */
  async getLatest(variableIdentifier: string) {
    const accessDataReq = {
      variable: variableIdentifier,
    };
    return await fetchLatestData(
      this.#baseUrl,
      this.#configHeaders,
      [this.#nodeId],
      accessDataReq
    );
  }

  /**/
  async setKey(reqConfig: _IAnedya_SetKey_Req_Obj): Promise<any> {
    return await setKey(
      this.#baseUrl,
      this.#configHeaders,
      [this.#nodeId],
      reqConfig
    );
  }

  /**/
  async getKey(reqConfig: _IAnedya_GetKey_Req_Obj): Promise<any> {
    return await getKey(
      this.#baseUrl,
      this.#configHeaders,
      [this.#nodeId],
      reqConfig
    );
  }

  /**/
  async deleteKey(reqConfig: _IAnedya_DeleteKey_Req_Obj): Promise<any> {
    return await deleteKey(
      this.#baseUrl,
      this.#configHeaders,
      [this.#nodeId],
      reqConfig
    );
  }

  /** */
  async scanValueStore(reqConfig: _IAnedya_ScanVS_Req_Obj): Promise<any> {
    return await scanValueStore(
      this.#baseUrl,
      this.#configHeaders,
      [this.#nodeId],
      reqConfig
    );
  }
}
