const { Anedya, Anedya_AccessData} = require("../dist/index");

const tokenId="4Sg4IPDAxYAcVVl1FfS6XbCO";
const token="FseKcRl04ieP7fjRprMtenrGuxcIZaoqKPXHB4yX1o8LgqrrpTCUf0J2xUSQGHP8";
const NodeId="0193e245-d735-7347-99d4-c0243ed11dfa"

// Initialize the Anedya client
let anedya = new Anedya();
let connect_config = anedya.NewConfig(tokenId,token);
let client = anedya.NewClient(connect_config);

let node_1 = anedya.NewNode(client, NodeId);

(async () => {
  try {
    currentTime = Math.floor(Date.now() / 1000); // time in seconds
    delayed_24_hours = currentTime - 86400;
    let get_data=new Anedya_AccessData;
    
    get_data.request={variable:"temperature",from:delayed_24_hours,to:currentTime,order:"asc"};
    get_data = await node_1.getData(get_data);
    if (get_data.response.isSuccess) {
      console.log(get_data);
    } else {
      console.error("Error fetching data:", get_data.response);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
})();