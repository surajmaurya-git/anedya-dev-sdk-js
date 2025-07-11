# Anedya SDK

The Anedya SDK is a JavaScript/TypeScript library that allows you to access the Anedya Platform API from your web application. It provides a simple and intuitive interface for interacting with the Anedya API, making it easy to integrate Anedya into your existing application.

## Installation

You can install the Anedya SDK using npm or yarn:

```bash
npm install anedya-sdk
```

or

```bash
yarn add anedya-sdk
```

## Usage

```javascript
import { Anedya, AnedyaGetDataBetweenRequest, AnedyaGetDataBetweenResponse} from "anedya-sdk";

const anedya = new Anedya();
const connect_config = anedya.NewConfig(tokenId, token);
const client = anedya.NewClient(connect_config);
const node_1 = anedya.NewNode(client, NodeId);

const getData_req = new AnedyaGetDataBetweenRequest(variableIdentifier,from_time,to_time);
let getData_resp = new AnedyaGetDataBetweenResponse();
getData_resp = await node_1.getData(getData_req);
```
