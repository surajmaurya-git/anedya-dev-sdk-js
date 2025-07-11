/*
 Access Data from the Anedya platform side api.
*/
import {
  _IAnedya_SetKey_Req_Obj,
  IAnedya_Generic_Resp_Obj,
  _IAnedya_GetKey_Req_Obj,
  IAnedya_GetKey_Resp_Obj,
  _IAnedya_DeleteKey_Req_Obj,
  _IAnedya_ScanVS_Req_Obj,
  AnedyaScanValueStoreRespInterface,
} from "../models";
import { anedyaSignature } from "../anedya_signature";
import { IConfigHeaders, _ITimeSeriesData } from "../common";

// ------------------------------ Set Value-Store -----------------------------
interface _IAnedya_SetKey_Resp_Obj {
  success: boolean;
  errorcode: number;
  error: string;
  reasonCode: string;
}

export const setKey = async (
  baseUrl: string,
  configHeaders: IConfigHeaders,
  nodes: string[],
  reqConfig: _IAnedya_SetKey_Req_Obj
): Promise<any> => {
  const url = `${baseUrl}/valuestore/setValue`;
  let Id;
  if (reqConfig.namespace.scope === "node") {
    Id = nodes[0];
  } else {
    Id = reqConfig.namespace.id;
  }

  const requestData = {
    namespace: {
      scope: reqConfig.namespace.scope,
      id: Id,
    },
    key: reqConfig.key,
    value: reqConfig.value,
    type: reqConfig.type,
  };
  const currentTime = Math.floor(Date.now() / 1000);
  const combinedHash = await anedyaSignature(
    requestData,
    configHeaders,
    currentTime
  );

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

    const responseData: _IAnedya_SetKey_Resp_Obj = await response.json();
    let res: IAnedya_Generic_Resp_Obj = {};
    res.isSuccess = responseData.success;
    if (!res.isSuccess) {
      res.reasonCode = responseData.reasonCode;
    }
    return res;
  } catch (error) {
    console.error("Error during fetch operation:", error);
    throw error;
  }
};

// ------------------------------ Get Value-Store -----------------------------
interface _IAnedya_GetKey_Resp_Obj {
  success: boolean;
  errorcode: number;
  error: string;
  reasonCode: string;
  namespace: {
    scope: string;
    id: string;
  };
  key: string;
  value: string | number | boolean;
  type: string;
  size: number;
  modified: number;
  created: number;
}

export const getKey = async (
  baseUrl: string,
  configHeaders: IConfigHeaders,
  nodes: string[],
  reqConfig: _IAnedya_GetKey_Req_Obj
): Promise<any> => {
  const url = `${baseUrl}/valuestore/getValue`;
  let Id;
  if (reqConfig.namespace.scope === "node") {
    Id = nodes[0];
  } else {
    Id = reqConfig.namespace.id;
  }

  const requestData = {
    namespace: {
      scope: reqConfig.namespace.scope,
      id: Id,
    },
    key: reqConfig.key,
  };
  const currentTime = Math.floor(Date.now() / 1000);
  const combinedHash = await anedyaSignature(
    requestData,
    configHeaders,
    currentTime
  );

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

    const responseData: _IAnedya_GetKey_Resp_Obj = await response.json();
    // console.log(responseData);
    let res: IAnedya_GetKey_Resp_Obj = {};
    res.isSuccess = responseData.success;
    res.reasonCode = responseData.reasonCode;
    if (!res.isSuccess) {
      return res;
    }
    res.namespace = responseData.namespace;
    res.key = responseData.key;
    res.value = responseData.value;
    res.type = responseData.type;
    res.size = responseData.size;
    res.modified = responseData.modified;
    res.created = responseData.created;
    return res;
  } catch (error) {
    console.error("Error during fetch operation:", error);
    throw error;
  }
};

// ------------------------------ Delete Value-Store -----------------------------
interface _IAnedya_DeleteKey_Resp_Obj {
  success: boolean;
  errorcode: number;
  error: string;
  reasonCode: string;
}

export const deleteKey = async (
  baseUrl: string,
  configHeaders: IConfigHeaders,
  nodes: string[],
  reqConfig: _IAnedya_DeleteKey_Req_Obj
): Promise<any> => {
  const url = `${baseUrl}/valuestore/delete`;
  let Id;
  if (reqConfig.namespace.scope === "node") {
    Id = nodes[0];
  } else {
    Id = reqConfig.namespace.id;
  }

  const requestData = {
    namespace: {
      scope: reqConfig.namespace.scope,
      id: Id,
    },
    key: reqConfig.key,
  };
  const currentTime = Math.floor(Date.now() / 1000);
  const combinedHash = await anedyaSignature(
    requestData,
    configHeaders,
    currentTime
  );

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

    const responseData: _IAnedya_DeleteKey_Resp_Obj = await response.json();
    // console.log(responseData);
    let res: IAnedya_Generic_Resp_Obj = {};
    res.isSuccess = responseData.success;
    res.reasonCode = responseData.reasonCode;
    return res;
  } catch (error) {
    console.error("Error during fetch operation:", error);
    throw error;
  }
};

// ------------------------------  Scan Value-Store -----------------------------
interface _IAnedya_ScanVS_Resp_Obj {
  success: boolean;
  errorcode: number;
  error: string;
  reasonCode: string;
  count: number;
  totalCount: number;
  data: any[];
  next: number;
}

export const scanValueStore = async (
  baseUrl: string,
  configHeaders: IConfigHeaders,
  nodes: string[],
  reqConfig: _IAnedya_ScanVS_Req_Obj
): Promise<any> => {
  const url = `${baseUrl}/valuestore/scan`;
  let Id;
  if (reqConfig.filter.namespace.scope === "node") {
    Id = nodes[0];
  } else {
    Id = reqConfig.filter.namespace.id;
  }

  const requestData = {
    filter: {
      namespace: {
        scope: reqConfig.filter.namespace.scope,
        id: Id,
      },
    },
    orderby: reqConfig.orderby,
    order: reqConfig.order,
    limit: reqConfig.limit,
    offset: reqConfig.offset,
  };
  const currentTime = Math.floor(Date.now() / 1000);
  const combinedHash = await anedyaSignature(
    requestData,
    configHeaders,
    currentTime
  );

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
    console.log(response);

    const responseData: _IAnedya_ScanVS_Resp_Obj = await response.json();
    let res: AnedyaScanValueStoreRespInterface = {};
    res.isSuccess = responseData.success;
    res.reasonCode = responseData.reasonCode;
    if(res.isSuccess){
      res.count = responseData.count;
      res.totalCount = responseData.totalCount;
      res.data = responseData.data;
      res.next = responseData.next;
    }
    return res;
  } catch (error) {
    console.error("Error during fetch operation:", error);
    throw error;
  }
};
