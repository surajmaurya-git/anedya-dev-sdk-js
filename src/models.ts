export interface _dataResponse {
  success: boolean;
  data: Record<string, any>;
}
// ============================== Data Access ==============================
export interface _timeSeriesData {
  [key: string]: object[]; // Adjust `object` to the exact type of elements in the array if possible
}

// ------------ Access Data ------------
export interface Anedya_AccessDataRequest {
  variable: string;
  from: number;
  to: number;
  limit: number;
  order: string;
}

export interface Anedya_AccessDataResponse {
  isSuccess: boolean;
  data: _timeSeriesData;
  errorcode: number;
  error: string;
}

export class Anedya_AccessData {
  request: Anedya_AccessDataRequest;
  response: Anedya_AccessDataResponse;

  constructor(request?: Partial<Anedya_AccessDataRequest>) {
    // Initialize with default values
    this.request = {
      variable: "",
      from: 0,
      to: 0,
      limit: 0,
      order: "",
      ...request, // Merge with provided request values
    };

    this.response = {
      isSuccess: false,
      data: {},
      errorcode: 0,
      error: "",
    };
  }
}


// ------------ Access latest data ------------
// export const DATA_TYPE_FLOAT: string = "float";
// export const DATA_TYPE_GEO_COORDINATES: string = "geo";
export class Anedya_AccessLatestData {
  request: {
    variable: string;
  } = {
    variable: "",
  };

  response: {
    isSuccess: boolean;
    data: Record<string, any>;
    errorcode: number;
    error: string;
  } = {
    isSuccess: false,
    data: {},
    errorcode: 0,
    error: "",
  };
  constructor(variable: string) {
    this.request = {
      variable: variable,
    };
  }
}

// ============================== Command Section ==============================
// ----------- Command Types -----------
export const COMMAND_TYPE_STRING: string = "string";
export const COMMAND_TYPE_BINARY: string = "binary";

export class Command {
  request: {
    commandName: string;
    data: string;
    dataType: string;
    nodeID: string;
    expiryTime_ms: number;
  } = {
    commandName: "",
    data: "",
    dataType: "",
    nodeID: "",
    expiryTime_ms: -1,
  };
  response: {
    isSuccess: boolean;
    success: boolean;
    error: string;
    errorcode: number;
    commandID: string;
  } = {
    isSuccess: false,
    success: false,
    error: "",
    errorcode: 0,
    commandID: "",
  };

  constructor(request: any) {
    this.request = request;
  }
}
