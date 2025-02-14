import { Anedya, Anedya_GetData_Req_Obj, Anedya_GetData_Resp_Obj } from "./dist/index.mjs";

// Configuration Constants
const tokenId = "4Sg4IPDAxYAcVVl1FfS6XbCO";
const token = "FseKcRl04ieP7fjRprMtenrGuxcIZaoqKPXHB4yX1o8LgqrrpTCUf0J2xUSQGHP8";
const NodeId = "0193e245-d735-7347-99d4-c0243ed11dfa";
const variableIdentifier = "temperature";
const testMode = true; // Use sandbox for testing

// Initialize Anedya Client
const anedya = new Anedya();
const connect_config = anedya.NewConfig(tokenId, token, testMode);
const client = anedya.NewClient(connect_config);
const node_1 = anedya.NewNode(client, NodeId);

// Function to get Node ID
async function getNodeId() {
  try {
    const nodeId = node_1.getNodeId();
    console.log("Node Id:", nodeId);
  } catch (error) {
    console.error("Error getting Node Id:", error);
  }
}

// Function to get Data
async function getData() {
  try {
    const currentTime = Math.floor(Date.now());  //time in milliseconds
    const delayed_24_hours = currentTime - 86400000;
    const getData_req = new Anedya_GetData_Req_Obj(variableIdentifier, delayed_24_hours, currentTime, 10);

    let getData_resp= new Anedya_GetData_Resp_Obj();

    getData_resp = await node_1.getData(getData_req);
    if (getData_resp.isSuccess) {
      if (getData_resp.isDataAvailable) {
        console.log("Data:", getData_resp.data);
      } else {
        console.log("No data available in requested timestamp!!");
      }
    } else {
      console.error("Error fetching data:", getData_resp.error);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Function to get Latest Data
async function getLatestData() {
  try {
    const getLatestData_resp = await node_1.getLatestData(variableIdentifier);
    if (getLatestData_resp.isSuccess) {
      if (getLatestData_resp.isDataAvailable) {
        console.log("Latest Data:", getLatestData_resp.data);
      } else {
        console.log("No latest data available!");
      }
    } else {
      console.error("Error fetching latest data:", getLatestData_resp.error);
    }
  } catch (error) {
    console.error("Error fetching latest data:", error);
  }
}

// Execute functions
(async () => {
  await getNodeId();
  await getData();
  await getLatestData();
})();
