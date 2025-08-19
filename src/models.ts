/*
 * This file contains the models for the Anedya SDK.
 * It exports interfaces and classes that are used to represent the data
 * and requests for the Anedya API.
 *
 */
import { _ITimeSeriesData, _errInterface } from "./common";

// ============================== Data Access ==============================
// ------------ Get Data ------------
export interface AnedyaGetDataBetweenReqInterface {
  variable: string;
  from: number;
  to: number;
  limit: number;
  order: "asc" | "desc";
}
/**
 * Request object for fetching data.
 */
export class AnedyaGetDataBetweenRequest
  implements AnedyaGetDataBetweenReqInterface
{
  constructor(
    public variable: string,
    public from: number,
    public to: number,
    public limit: number = 10000,
    public order: "asc" | "desc" = "desc"
  ) {
    if (order !== "asc" && order !== "desc") {
      throw new Error(
        "Invalid order value. It should be either 'asc' or 'desc'."
      );
    }
    if (limit < 1) {
      throw new Error("Invalid limit value. It should be at least 1.");
    }
    if (from > to) {
      throw new Error(
        "Invalid time range. 'from' should be less than or equal to 'to'."
      );
    }
  }
}

export interface AnedyaGetDataBetweenRespInterface {
  isSuccess: boolean;
  error: _errInterface;
  isDataAvailable: boolean;
  data: _ITimeSeriesData | null;
  count: number;
  startTime: number;
  endTime: number;
}
/**
 * Response object for fetching data.
 */
export class AnedyaGetDataBetweenResponse
  implements AnedyaGetDataBetweenRespInterface
{
  isSuccess: boolean;
  error: _errInterface;
  isDataAvailable: boolean;
  data: _ITimeSeriesData | null;
  count: number;
  startTime: number;
  endTime: number;
  constructor() {
    this.isSuccess = false;
    this.error = { errorMessage: "", reasonCode: "" };
    this.isDataAvailable = false;
    this.data = null;
    this.count = 0;
    this.startTime = 0;
    this.endTime = 0;
  }
}

// ----------------------------- Get Latest Data -------------------------------------------
export interface AnedyaLatestDataRespInterface {
  isSuccess?: boolean;
  error: _errInterface;
  isDataAvailable?: boolean;
  data?: _ITimeSeriesData | null;
}

export class AnedyaLatestDataResponse implements AnedyaLatestDataRespInterface {
  isSuccess?: boolean;
  error: _errInterface;
  isDataAvailable?: boolean;
  data?: _ITimeSeriesData | null;
  constructor() {
    this.isSuccess = false;
    this.error = { errorMessage: "", reasonCode: "" };
    this.isDataAvailable = false;
    this.data = null;
  }
}

// ================================ Value Store ================================
// ------------ Set Value-Store ------------
export interface AnedyaSetKeyRequestInterface {
  namespace: {
    scope: "global" | "node";
    // id: string;
  };
  key: string;
  value: string | number | boolean;
  type: "string" | "binary" | "float" | "boolean";
}

export class AnedyaSetKeyRequest implements AnedyaSetKeyRequestInterface {
  constructor(
    public namespace: {
      scope: "global" | "node";
      // id: string;
    },
    public key: string,
    public value: string | number | boolean,
    public type: "string" | "binary" | "float" | "boolean"
  ) {
    if (this.namespace.scope !== "global" && this.namespace.scope !== "node") {
      throw new Error(
        "Invalid namespace scope. It should be either 'global' or 'node'."
      );
    }
    if (
      this.type !== "string" &&
      this.type !== "binary" &&
      this.type !== "float" &&
      this.type !== "boolean"
    ) {
      throw new Error(
        "Invalid type value. It should be either 'string', 'binary', 'float', or 'boolean'."
      );
    }
  }
}

export interface AnedyaSetKeyRespInterface {
  isSuccess: boolean;
  error: _errInterface;
}

export class AnedyaSetKeyResponse implements AnedyaSetKeyRespInterface {
  isSuccess: boolean;
  error: _errInterface;
  constructor() {
    this.isSuccess = false;
    this.error = { errorMessage: "", reasonCode: "" };
  }
}

// ------------ Get Value-Store ------------
export interface AnedyaGetKeyReqInterface {
  namespace: {
    scope: "global" | "node";
    // id: string;
  };
  key: string;
}

export class AnedyaGetKeyRequest implements AnedyaGetKeyReqInterface {
  constructor(
    public namespace: {
      scope: "global" | "node";
      // id: string;
    },
    public key: string
  ) {
    if (this.namespace.scope !== "global" && this.namespace.scope !== "node") {
      throw new Error(
        "Invalid namespace scope. It should be either 'global' or 'node'."
      );
    }
  }
}

export interface AnedyaGetKeyRespInterface {
  isSuccess: boolean;
  error: _errInterface;
  namespace: {
    scope: string;
    id: string;
  };
  key: string;
  value: string | number | boolean;
  type: string;
  size: number;
  modified: number;
  created: number;
}

export class AnedyaGetKeyResponse implements AnedyaGetKeyRespInterface {
  isSuccess: boolean;
  error: _errInterface;
  namespace: {
    scope: string;
    id: string;
  };
  key: string;
  value: string | number | boolean | any;
  type: string;
  size: number;
  modified: number;
  created: number;
  constructor() {
    this.isSuccess = false;
    this.error = { errorMessage: "", reasonCode: "" };
    this.namespace = { scope: "", id: "" };
    this.key = "";
    this.value = undefined;
    this.type = "";
    this.size = 0;
    this.modified = 0;
    this.created = 0;
  }
}

// ------------ Delete Value-Store ------------

export interface AnedyaDeleteKeyReqInterface {
  namespace: {
    scope: "global" | "node";
    // id: string;
  };
  key: string;
}

export class AnedyaDeleteKeyRequest implements AnedyaDeleteKeyReqInterface {
  constructor(
    public namespace: {
      scope: "global" | "node";
      // id: string;
    },
    public key: string
  ) {
    if (this.namespace.scope !== "global" && this.namespace.scope !== "node") {
      throw new Error(
        "Invalid namespace scope. It should be either 'global' or 'node'."
      );
    }
  }
}

export interface AnedyaDeleteKeyRespInterface {
  isSuccess: boolean;
  error: _errInterface;
}

export class AnedyaDeleteKeyResponse implements AnedyaDeleteKeyRespInterface {
  isSuccess: boolean;
  error: _errInterface;
  constructor() {
    this.isSuccess = false;
    this.error = { errorMessage: "", reasonCode: "" };
  }
}

// ---------------- Value Store Scan ----------------

export interface AnedyaScanValueStoreReqInterface {
  filter: {
    namespace: {
      scope: "global" | "node";
      // id: string;
    };
  };
  orderby: "namespace" | "key" | "created";
  order: "asc" | "desc";
  limit: number;
  offset: number;
}

export class AnedyaScanValueStoreRequest
  implements AnedyaScanValueStoreReqInterface
{
  constructor(
    public filter: {
      namespace: {
        scope: "global" | "node";
        // id: string;
      };
    },
    public orderby: "namespace" | "key" | "created",
    public order: "asc" | "desc",
    public limit: number,
    public offset: number
  ) {
    if (
      this.filter.namespace.scope !== "global" &&
      this.filter.namespace.scope !== "node"
    ) {
      throw new Error(
        "Invalid namespace scope. It should be either 'global' or 'node'."
      );
    }
  }
}

export interface AnedyaScanValueStoreRespInterface {
  isSuccess: boolean;
  error: _errInterface;
  count: number;
  totalCount: number;
  data: any;
  next: number;
}

export class AnedyaScanValueStoreResponse
  implements AnedyaScanValueStoreRespInterface
{
  isSuccess: boolean;
  error: _errInterface;
  count: number;
  totalCount: number;
  data: any;
  next: number;
  constructor() {
    this.isSuccess = false;
    this.error = { errorMessage: "", reasonCode: "" };
    this.count = 0;
    this.totalCount = 0;
    this.data = undefined;
    this.next = 0;
  }
}

// ---------------- Device Status ----------------

export interface AnedyaDeviceStatusRespInterface {
  isSuccess: boolean;
  error: _errInterface;
  data: any;
}

export class AnedyaDeviceStatusResponse
  implements AnedyaDeviceStatusRespInterface
{
  isSuccess: boolean;
  error: _errInterface;
  data: any;
  constructor() {
    this.isSuccess = false;
    this.error = { errorMessage: "", reasonCode: "" };
    this.data = undefined;
  }
}
