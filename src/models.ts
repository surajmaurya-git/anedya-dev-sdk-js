/*
 * This file contains the models for the Anedya SDK.
 * It exports interfaces and classes that are used to represent the data
 * and requests for the Anedya API.
 *
 */
import { _ITimeSeriesData } from "./common";

// ============================== Generic Response Handling ==============================
export interface AnedyaGenericResponseInterface {
  isSuccess: boolean;
  reasonCode: string;
}

export class Anedya_Generic_Resp_Obj implements AnedyaGenericResponseInterface {
  constructor(public isSuccess: boolean, public reasonCode: string) {
    this.isSuccess = isSuccess;
    this.reasonCode = reasonCode;
  }
}

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
export class AnedyaGetDataBetweenRequest implements AnedyaGetDataBetweenReqInterface {
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
  reasonCode: string;
  isDataAvailable: boolean;
  data: _ITimeSeriesData | null;
  count: number;
  startTime: number;
  endTime: number;
}
/**
 * Response object for fetching data.
 */
export class AnedyaGetDataBetweenResponse implements AnedyaGetDataBetweenRespInterface {
  constructor(
    public isSuccess: boolean = false,
    public reasonCode: string,
    public isDataAvailable: boolean = false,
    public data: _ITimeSeriesData | null,
    public count: number,
    public startTime: number,
    public endTime: number
  ) {}
}

// ----------------------------- Get Latest Data -------------------------------------------
export interface AnedyaLatestDataRespInterface {
  isSuccess?: boolean;
  isDataAvailable?: boolean;
  data?: _ITimeSeriesData | null;
  reasonCode?: string;
}

export class AnedyaLatestDataResponse
  implements AnedyaLatestDataRespInterface
{
  constructor(
    public isSuccess: boolean = false,
    public isDataAvailable: boolean = false,
    public data: _ITimeSeriesData | null,
    public reasonCode: string
  ) {
    this.isSuccess = isSuccess;
    this.isDataAvailable = isDataAvailable;
    this.data = data;
    this.reasonCode = reasonCode;
  }
}

// ================================ Value Store ================================
// ------------ Set Value-Store ------------
export interface AnedyaSetKeyRequestInterface {
  namespace: {
    scope: "global" | "node";
    id: string;
  };
  key: string;
  value: string | number | boolean;
  type: "string" | "binary" | "float" | "boolean";
}

export class AnedyaSetKeyRequest implements AnedyaSetKeyRequestInterface {
  constructor(
    public namespace: {
      scope: "global" | "node";
      id: string;
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
  reasonCode: string;
}

export class AnedyaSetKeyResponse implements AnedyaSetKeyRespInterface {
  constructor(public isSuccess: boolean, public reasonCode: string) {
    this.isSuccess = isSuccess;
    this.reasonCode = reasonCode;
  }
}

// ------------ Get Value-Store ------------
export interface AnedyaGetKeyReqInterface {
  namespace: {
    scope: "global" | "node";
    id: string;
  };
  key: string;
}

export class AnedyaGetKeyRequest implements AnedyaGetKeyReqInterface {
  constructor(
    public namespace: {
      scope: "global" | "node";
      id: string;
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
  reasonCode: string;
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
  constructor(
    public isSuccess: boolean,
    public reasonCode: string,
    public namespace: {
      scope: string;
      id: string;
    },
    public key: string,
    public value: string | number | boolean,
    public type: string,
    public size: number,
    public modified: number,
    public created: number
  ) {
    this.isSuccess = isSuccess;
    this.reasonCode = reasonCode;
    this.namespace = namespace;
    this.key = key;
    this.value = value;
    this.type = type;
    this.size = size;
    this.modified = modified;
    this.created = created;
  }
}

// ------------ Delete Value-Store ------------

export interface AnedyaDeleteKeyReqInterface {
  namespace: {
    scope: "global" | "node";
    id: string;
  };
  key: string;
}

export class AnedyaDeleteKeyRequest implements AnedyaDeleteKeyReqInterface {
  constructor(
    public namespace: {
      scope: "global" | "node";
      id: string;
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
  reasonCode: string;
}

export class AnedyaDeleteKeyResponse implements AnedyaDeleteKeyRespInterface {
  constructor(public isSuccess: boolean, public reasonCode: string) {
    this.isSuccess = isSuccess;
    this.reasonCode = reasonCode;
  }
}

// ---------------- Value Store Scan ----------------

export interface AnedyaScanValueStoreReqInterface {
  filter: {
    namespace: {
      scope: "global" | "node";
      id: string;
    };
  };
  orderby: "namespace" | "key" | "created";
  order: "asc" | "desc";
  limit: number;
  offset: number;
}

export class AnedyaScanValueStoreRequest implements AnedyaScanValueStoreReqInterface {
  constructor(
    public filter: {
      namespace: {
        scope: "global" | "node";
        id: string;
      };
    },
    public orderby: "namespace" | "key" | "created",
    public order: "asc" | "desc",
    public limit: number,
    public offset: number
  ) {
    if (this.filter.namespace.scope !== "global" && this.filter.namespace.scope !== "node") {
      throw new Error(
        "Invalid namespace scope. It should be either 'global' or 'node'."
      );
    }

  }
}

export interface AnedyaScanValueStoreRespInterface {
  isSuccess: boolean;
  reasonCode: string;
  count: number;
  totalCount: number;
  data: any;
  next: number;
}


export class AnedyaScanValueStoreResponse implements AnedyaScanValueStoreRespInterface {
  constructor(
    public isSuccess: boolean,
    public reasonCode: string,
    public count: number,
    public totalCount: number,
    public data: any,
    public next: number
  ) {
    this.isSuccess = isSuccess;
    this.reasonCode = reasonCode;
    this.count = count;
    this.totalCount = totalCount;
    this.data = data;
    this.next = next;
  }
}

// ---------------- Device Status ----------------

export interface AnedyaDeviceStatusRespInterface {
  isSuccess: boolean;
  reasonCode: string;
  data: any;
}

export class AnedyaDeviceStatusResponse implements AnedyaDeviceStatusRespInterface {
  constructor(
    public isSuccess: boolean,
    public reasonCode: string,
    public data: any
  ) {
    this.isSuccess = isSuccess;
    this.reasonCode = reasonCode;
    this.data = data;
  }
}