import {
  _IAnedya_GetData_Req,
  _IAnedya_GetLatestData_Req,
  IAnedya_GetData_Resp,
  IAnedya_GetLatestData_Resp,
} from "../models";
import { IConfigHeaders, _ITimeSeriesData } from "../commoni";

// ------------------------------ Get Data -----------------------------
interface _IAnedya_GetData_Resp {
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
  accessDataReq: _IAnedya_GetData_Req
): Promise<any> => {
  const url = `${baseUrl}/data/getData`;

  const requestData = {
    nodes: nodes,
    variable: accessDataReq.variable,
    from: accessDataReq.from,
    to: accessDataReq.to,
    limit: accessDataReq.limit,
    order: accessDataReq.order,
  };

  const encoder = new TextEncoder();
  const bodyBytes = encoder.encode(JSON.stringify(requestData));

  // Create SHA-256 hash of the bodyBytes
  const bodyHashBuffer = await crypto.subtle.digest("SHA-256", bodyBytes);
  const bodyHashBytes = new Uint8Array(bodyHashBuffer);

  const currentTime = Math.floor(Date.now() / 1000);
  const timeBytes = new Uint8Array(8);
  new DataView(timeBytes.buffer).setBigUint64(0, BigInt(currentTime), false); // Big-endian

  // Combine [bodyHashBytes, timeBytes, signatureVersionBytes, tokenBytes]
  const combinedBytes = new Uint8Array(
    bodyHashBytes.length +
      timeBytes.length +
      configHeaders.signatureVersionBytes.length +
      configHeaders.tokenBytes.length
  );
  combinedBytes.set(bodyHashBytes, 0);
  combinedBytes.set(timeBytes, bodyHashBytes.length);
  combinedBytes.set(
    configHeaders.signatureVersionBytes,
    bodyHashBytes.length + timeBytes.length
  );
  combinedBytes.set(
    configHeaders.tokenBytes,
    bodyHashBytes.length +
      timeBytes.length +
      configHeaders.signatureVersionBytes.length
  );

  // Compute SHA-256 hash of combinedBytes
  const combinedHashBuffer = await crypto.subtle.digest(
    "SHA-256",
    combinedBytes
  );
  const combinedHash = Array.from(new Uint8Array(combinedHashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

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

    const responseData: _IAnedya_GetData_Resp = await response.json();
    let res: IAnedya_GetData_Resp = {};

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
  accessDataReq: _IAnedya_GetLatestData_Req
): Promise<any> => {
  const url = `${baseUrl}/data/latest`;

  const requestData = {
    nodes: nodes,
    variable: accessDataReq.variable,
  };

  const encoder = new TextEncoder();
  const bodyBytes = encoder.encode(JSON.stringify(requestData));

  // Create SHA-256 hash of the bodyBytes
  const bodyHashBuffer = await crypto.subtle.digest("SHA-256", bodyBytes);
  const bodyHashBytes = new Uint8Array(bodyHashBuffer);

  const currentTime = Math.floor(Date.now() / 1000);
  const timeBytes = new Uint8Array(8);
  new DataView(timeBytes.buffer).setBigUint64(0, BigInt(currentTime), false); // Big-endian

  // Combine [bodyHashBytes, timeBytes, signatureVersionBytes, tokenBytes]
  const combinedBytes = new Uint8Array(
    bodyHashBytes.length +
      timeBytes.length +
      configHeaders.signatureVersionBytes.length +
      configHeaders.tokenBytes.length
  );
  combinedBytes.set(bodyHashBytes, 0);
  combinedBytes.set(timeBytes, bodyHashBytes.length);
  combinedBytes.set(
    configHeaders.signatureVersionBytes,
    bodyHashBytes.length + timeBytes.length
  );
  combinedBytes.set(
    configHeaders.tokenBytes,
    bodyHashBytes.length +
      timeBytes.length +
      configHeaders.signatureVersionBytes.length
  );

  // Compute SHA-256 hash of combinedBytes
  const combinedHashBuffer = await crypto.subtle.digest(
    "SHA-256",
    combinedBytes
  );
  const combinedHash = Array.from(new Uint8Array(combinedHashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

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
    let res: IAnedya_GetLatestData_Resp = {};

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
