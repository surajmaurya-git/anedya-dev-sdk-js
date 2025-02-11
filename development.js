const { Anedya, Anedya_GetData_Req, Anedya_GetData_Resp} = require("./dist/index");
const { Anedya_GetlatestData_Resp } = require("./dist/models");

const tokenId="4Sg4IPDAxYAcVVl1FfS6XbCO";
const token="FseKcRl04ieP7fjRprMtenrGuxcIZaoqKPXHB4yX1o8LgqrrpTCUf0J2xUSQGHP8";
const NodeId="0193e245-d735-7347-99d4-c0243ed11dfa"

// Initialize the Anedya client
let anedya = new Anedya();
let connect_config = anedya.NewConfig(tokenId,token,true);  // create config 
let client = anedya.NewClient(connect_config); // create anedya client

let node_1 = anedya.NewNode(client, NodeId);  // create node client 
const variableIdentifier="temperature";

//======================= Get Data =========================================
(async () => {
  try {
    const currentTime = Math.floor(Date.now() / 1000); // time in seconds
    const delayed_24_hours = currentTime - 86400;
    let getData_req=new Anedya_GetData_Req;
    getData_req.variable=variableIdentifier;
    getData_req.from=delayed_24_hours;
    getData_req.to=currentTime;
    
    let getData_resp=new Anedya_GetData_Resp;
    
    getData_resp = await node_1.getData(getData_req);
    if (getData_resp.isSuccess) {
      if(getData_resp.isDataAvailable){
        console.log("Data;",getData_resp.data);
      }else{
        console.log("No data available in requested timestamp!!");
      }
    } else {
      console.error("Error fetching data:", getData_resp.error);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
})();

//============================ Get Latest Data =============================
(async () => {
  try {
    let getLatestData_resp=new Anedya_GetlatestData_Resp;
    getLatestData_resp=await node_1.getlatestData(variableIdentifier);
  
    if (getLatestData_resp.isSuccess) {
      if (getLatestData_resp.isDataAvailable) {
        console.log("Latest Data:",getLatestData_resp.data);
      } else {
        console.log("No latest data available!");
      }
    } else {
      console.error("Error fetching latest data:", getLatestData_resp.error);
    }
  } catch (error) {
    console.error("Error fetching latest datasd:", error);
  }
})(); 