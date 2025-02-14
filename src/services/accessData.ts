/*
 Access Data from the Anedya platform side api.
*/
import {
  _IAnedya_GetData_Req_Obj,
  _IAnedya_GetLatestData_Req_Obj,
  IAnedya_GetData_Resp_Obj,
  IAnedya_GetLatestData_Resp_Obj,
} from "../models";
import { anedyaHashing } from "../anedya_hashing";
import { IConfigHeaders, _ITimeSeriesData } from "../common_i";

// ------------------------------ Get Data -----------------------------
interface _IAnedya_GetData_Resp_Obj {
  success: boolean;
  data: _ITimeSeriesData | null;
  errorcode: number;
  error: string;
  reasonCode: string;
  count: number;
  startTime: number;
  endTime: number;
}

export const fetchData = async (
  baseUrl: string,
  configHeaders: IConfigHeaders,
  nodes: string[],
  accessDataReq: _IAnedya_GetData_Req_Obj
): Promise<any> => {
  const url = `${baseUrl}/data/getData`;

  const requestData = {
    nodes: nodes,
    variable: accessDataReq.variable,
    from: Math.floor(accessDataReq.from/1000), 
    to: Math.floor(accessDataReq.to/1000),   
    limit: accessDataReq.limit,
    order: accessDataReq.order,
  };
  const currentTime = Math.floor(Date.now() / 1000);
  const combinedHash = await anedyaHashing(requestData,configHeaders,currentTime);

  try {
    const reqHeaders = {
      Authorization: configHeaders.authorizationMode,
      "x-Anedya-SignatureVersion": configHeaders.signatureVersion,
      "X-Anedya-Tokenid": configHeaders.tokenId,
      "X-Anedya-Timestamp": currentTime.toString(),
      "X-Anedya-Signature": combinedHash,
      "Content-Type": "application/json",
    };
    // console.log(reqHeaders);

    const response = await fetch(url, {
      method: "POST",
      credentials: "same-origin",
      headers: reqHeaders,
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      console.error(
        `HTTP error! Status: ${
          response.status
        } Response: ${await response.text()}`
      );
      return null;
    }

    const responseData: _IAnedya_GetData_Resp_Obj = await response.json();
    let res: IAnedya_GetData_Resp_Obj = {};

    res.isSuccess = responseData.success;
    if (responseData.success) {
      let data: any = responseData.data;
      if (data == undefined || data == null || Object.keys(data).length === 0) {
        data = null;
        res.isDataAvailable = false;
        return res;
      }
      if (nodes.length === 1) {
        data = data[nodes.toString()];
        res.data = data;
        res.isDataAvailable = true;
      } else {
        res.data = data;
        res.isDataAvailable = true;
      }
      res.count = responseData.count;
      res.startTime = responseData.startTime;
      res.endTime = responseData.endTime;
    } else {
      res.isSuccess = responseData.success;
      res.error = responseData.error;
    }
    return res;
  } catch (error) {
    console.error("Error during fetch operation:", error);
    throw error;
  }
};

// ------------------------------ Get Latest Data -----------------------------
interface _IAnedya_GetlatestData_Resp {
  success: boolean;
  data: _ITimeSeriesData | null;
  errorcode: number;
  error: string;
  reasonCode: string;
  count: number;
}

export const fetchLatestData = async (
  baseUrl: string,
  configHeaders: IConfigHeaders,
  nodes: string[],
  accessDataReq: _IAnedya_GetLatestData_Req_Obj
): Promise<any> => {
  const url = `${baseUrl}/data/latest`;

  const requestData = {
    nodes: nodes,
    variable: accessDataReq.variable,
  };
  const currentTime = Math.floor(Date.now() / 1000);
  const combinedHash = await anedyaHashing(requestData,configHeaders,currentTime);
  try {
    const reqHeaders = {
      Authorization: configHeaders.authorizationMode,
      "x-Anedya-SignatureVersion": configHeaders.signatureVersion,
      "X-Anedya-Tokenid": configHeaders.tokenId,
      "X-Anedya-Timestamp": currentTime.toString(),
      "X-Anedya-Signature": combinedHash,
      "Content-Type": "application/json",
    };

    const response = await fetch(url, {
      method: "POST",
      credentials: "same-origin",
      headers: reqHeaders,
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      console.error(
        `HTTP error! Status: ${
          response.status
        } Response: ${await response.text()}`
      );
      return null;
    }

    const responseData: _IAnedya_GetlatestData_Resp = await response.json();
    let res: IAnedya_GetLatestData_Resp_Obj = {};

    res.isSuccess = responseData.success;
    if (responseData.success) {
      let data: any = responseData.data;
      if (data == undefined || data == null || Object.keys(data).length === 0) {
        data = null;
        res.isDataAvailable = false;
        return res;
      }
      if (nodes.length === 1) {
        data = data[nodes.toString()];
        res.data = data;
        res.isDataAvailable = true;
      } else {
        res.data = data;
        res.isDataAvailable = true;
      }
    } else {
      res.isSuccess = responseData.success;
      res.error = responseData.error;
    }
    return res;
  } catch (error) {
    console.error("Error during fetch operation:", error);
    throw error;
  }
};
