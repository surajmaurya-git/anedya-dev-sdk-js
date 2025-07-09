import {
  Anedya,
  Anedya_GetData_Req_Obj,
  Anedya_GetData_Resp_Obj,
  Anedya_SetKey_Req_Obj,
} from "../dist/index.mjs";

// Configuration Constants
const tokenId = "ImP9zIFpf7FPk9nISchrQ8ge";
const token =
  "0yxR8BnzGtOQkdHo6ib7GyNETlR6TPxtKHSFrnT88ryMiiNDk8yvm7IBEnYPE0IS";
const NodeId = "0197ef38-7112-77cf-83a1-78317686ade1";
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
    const currentTime = Math.floor(Date.now()); //time in milliseconds
    const delayed_24_hours = currentTime - 86400 * 1000;
    const getData_req = new Anedya_GetData_Req_Obj(
      variableIdentifier,
      delayed_24_hours,
      currentTime,
      10
    );

    let getData_resp = new Anedya_GetData_Resp_Obj();

    // const res = await node_1.getData(getData_req);
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

async function setKey() {
  try {
    let setKeyConfig = new Anedya_SetKey_Req_Obj(
      { scope: "node", id: node_1.getNodeId() },
      "temperature",
      30,
      "float"
    );
    const setKey_resp = await node_1.setKey(setKeyConfig);
    if (setKey_resp.isSuccess) {
      console.log("Key set successfully!");
    } else {
      console.error("Error setting key:", setKey_resp);
    }
  } catch (error) {
    console.error("Error setting key 2:", error);
  }
}

// Execute functions
(async () => {
  await getNodeId();
  // await getData();
  // await getLatestData();
  await setKey();
})();
