import { Anedya_AccessData, _timeSeriesData } from "../models";
import { IConfigHeaders } from "../interface";

interface _accessDataResponse {
  success: boolean;
  data: _timeSeriesData;
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
  accessDataReq: Anedya_AccessData
): Promise<any> => {
  const url = `${baseUrl}/data/getData`;

  const requestData = {
    nodes: nodes,
    variable: accessDataReq.request.variable,
    from: accessDataReq.request.from,
    to: accessDataReq.request.to,
    limit: accessDataReq.request.limit,
    order: accessDataReq.request.order,
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
    bodyHashBytes.length + timeBytes.length + configHeaders.signatureVersionBytes.length
  );

  // Compute SHA-256 hash of combinedBytes
  const combinedHashBuffer = await crypto.subtle.digest("SHA-256", combinedBytes);
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
        `HTTP error! Status: ${response.status} Response: ${await response.text()}`
      );
      return null;
    }

    const responseData: _accessDataResponse = await response.json();

    accessDataReq.response.isSuccess = responseData.success;
    if (responseData.success) {
      let data: any = responseData.data;
      if (nodes.length === 1) {
        data = data[nodes.toString()];
        accessDataReq.response.data = data !== undefined ? data : {};
      } else {
        accessDataReq.response.data = data;
      }
    } else {
      accessDataReq.response.isSuccess = responseData.success;
      accessDataReq.response.errorcode = responseData.errorcode;
      accessDataReq.response.error = responseData.error;
    }
    return accessDataReq;
  } catch (error) {
    console.error("Error during fetch operation:", error);
    throw error;
  }
};
