/*
 Access Data from the Anedya platform side api.
*/
import { _IAnedya_SetKey_Req_Obj, Anedya_Generic_Resp_Obj } from "../models";
import { anedyaSignature } from "../anedya_signature";
import { IConfigHeaders, _ITimeSeriesData } from "../common_i";

// ------------------------------ Set Value-Store -----------------------------
interface _IAnedya_SetKey_Resp_Obj {
  success: boolean;
  errorcode: number;
  error: string;
  reasonCode: string;
}

export const setkey = async (
  baseUrl: string,
  configHeaders: IConfigHeaders,
  nodes: string[],
  setKeyConfig: _IAnedya_SetKey_Req_Obj
): Promise<any> => {
  const url = `${baseUrl}/valuestore/setValue`;
  let Id;
  if (setKeyConfig.namespace.scope === "node") {
    Id = nodes[0];
  } else {
    Id = setKeyConfig.namespace.id;
  }

  const requestData = {
    namespace: {
      scope: setKeyConfig.namespace.scope,
      id: Id,
    },
    key: setKeyConfig.key,
    value: setKeyConfig.value,
    type: setKeyConfig.type,
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
    let res: Anedya_Generic_Resp_Obj = {};
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
