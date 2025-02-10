import { _dataResponse } from '../models';
export const fetchLatestData = async (
  baseUrl: string,
  apiKey: string,
  nodes: string[],
  variable: string
): Promise<any> => {
  const url = `${baseUrl}/data/latest`;
  // console.log("Base URL:", url);

  const requestData = {
    nodes: nodes,
    variable: variable,
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
    
    const responseData: _dataResponse = await response.json();

    if (responseData.success) {
      let data: any = responseData.data;
      if (nodes.length==1) {
        data = data[nodes.toString()];
        return data;
      }else{
        return data;
      }
    } else {
      console.error("Error during fetch operation:", responseData);
      return responseData;
    }
  } catch (error) {
    console.error("Error during fetch operation:", error);
    throw error;
  }
};
