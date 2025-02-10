import { Command } from "../models";

interface _commandResponse {
  success: boolean;
  error: string;
  errorcode: number;
  commandId: string;
}

export const sendCommand = async (
  baseUrl: string,
  apiKey: string,
  nodeID: string,
  command: Command
): Promise<any> => {
  const url = `${baseUrl}/commands/send`;
  // console.log("Base URL:", url);

  if (command.request.expiryTime_ms === -1) {
    console.error("Expiry time is not set");
    return command;
  }

  const requestData = {
    nodeid: nodeID,
    command: command.request.commandName,
    data: command.request.data,
    type: command.request.dataType,
    expiry: command.request.expiryTime_ms,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      console.error(
        `HTTP error! Status: ${
          response.status
        } Response: ${await response.text()}`
      );
      command.response.isSuccess = false;
      return command;
    }
    if (response.status === 200) {
      command.response.isSuccess = true;
      const res:_commandResponse = await response.json();
      command.response.success = res.success;
      command.response.error = res.error;
      command.response.errorcode = res.errorcode;
      command.response.commandID = res.commandId;
    }
    return command;
  } catch (error) {
    console.error("Error during fetch operation:", error);
    throw error;
  }
};
