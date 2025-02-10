import { _dataResponse } from '../models';

interface _INodeListResponse {
  success: boolean;
  errorcode: number;
  error: string;
  reasonCode: string;
  currentCount: number;
  totalCount : number;
  nodes : string[];
  offset : number;
}

export const fetchNodeList = async (
  baseUrl: string,
  apiKey: string,
  limit: number=100,
  offset: number=0,
  order: string="desc"
): Promise<any> => {
  const url = `${baseUrl}/node/list`;
  // console.log("Base URL:", url);

  const requestData = {
    limit : limit,
    offset : offset,
    order : order
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestData),
    });
    
    if (!response.ok) {
      console.error(`HTTP error! Status: ${response.status} Response: ${ await response.text()}`);
      return null;
    }
    
    const responseData: _INodeListResponse = await response.json();

    if (responseData.success) {
      const nodes: string[] = responseData.nodes;
      return nodes;
    } else {
      console.error("Error during fetch operation:", responseData);
      return responseData;
    }
  } catch (error) {
    console.error("Error during fetch operation:", error);
    throw error;
  }
};
