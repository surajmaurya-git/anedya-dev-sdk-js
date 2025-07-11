import {
  Anedya,
  AnedyaGetDataBetweenRequest,
  AnedyaGetDataBetweenResponse,
  Anedya_SetKey_Req_Obj,
  Anedya_GetKey_Req_Obj,
  AnedyaScope,
  AnedyaDataType,
  getAnedyaErrorMessage,
  AnedyaScanValueStoreRespObject,
  Anedya_ScanValueStore_Req_Obj
} from "../dist/index.mjs";

// Configuration Constants
const tokenId = "FuaPdaamlVEpbttIEQJK4DSn";
const token =
  "A8jmY8FwfCk2vlg3sGWNpzvVKMZn2E0ZKIGJKwTsioB4nlVNU50PBAObMrjfy8Gc";
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
    const getData_req = new AnedyaGetDataBetweenRequest(
      variableIdentifier,
      delayed_24_hours,
      currentTime,
      10
    );
    let getData_resp = new AnedyaGetDataBetweenResponse();

    // const res = await node_1.getData(getData_req);
    getData_resp = await node_1.getDataBetween(getData_req);
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
    const getLatestData_resp = await node_1.getLatest(variableIdentifier);
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
      { scope: AnedyaScope.NODE },
      "temperature",
      30,
      AnedyaDataType.FLOAT
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

async function getKey() {
  try {
    let getKeyConfig = new Anedya_GetKey_Req_Obj(
      { scope: "node" },
      "temperature"
    );
    const getKey_resp = await node_1.getKey(getKeyConfig);
    if (getKey_resp.isSuccess) {
      console.log("Key fetched successfully!");
    } else {
      console.error("Error fetching key:", getKey_resp);
    }
  } catch (error) {
    console.error("Error fetching key 2:", error);
  }
}

async function deleteKey() {
  try {
    let deleteKeyConfig = new Anedya_GetKey_Req_Obj(
      { scope: "node" },
      "temperature"
    );
    const deleteKey_resp = await node_1.deleteKey(deleteKeyConfig);
    if (deleteKey_resp.isSuccess) {
      console.log("Key deleted successfully!");
    } else {
      console.error("Error deleting key:", deleteKey_resp);
    }
  } catch (error) {
    console.error("Error deleting key 2:", error);
  }
}

async function scanValueStore() {
  try {
    let scanValueStoreConfig = new Anedya_ScanValueStore_Req_Obj(
      { namespace: { scope: AnedyaScope.NODE } },
      "namespace",
      "asc",
      10,
      0
    );
    const scanValueStore_resp = await node_1.scanValueStore(scanValueStoreConfig);
    console.log(scanValueStore_resp);
    if (scanValueStore_resp.isSuccess) {
      console.log("Value Store scanned successfully!");
    } else {
      console.error("Error scanning Value Store:", scanValueStore_resp);
    }
  } catch (error) {
    console.error("Error scanning Value Store 2:", error);
  }
}

// Functionn to get device status
async function getDeviceStatus() {
  try {
    const deviceStatus = await node_1.deviceStatus(10);
    console.log("Device Status:", deviceStatus);
  } catch (error) {
    console.error("Error getting Device Status:", error);
  }
}

// Execute functions
(async () => {
  await getNodeId();
  await getData();
  // await getLatestData();
  // await setKey();
  // await getKey();
  // // await deleteKey();
  // await scanValueStore();
  // await getDeviceStatus();
})();
