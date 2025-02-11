import {_ITimeSeriesData} from "./commoni";

// ============================== Data Access ==============================
// ------------ Get Data ------------
export interface _IAnedya_GetData_Req {
  variable: string;
  from: number;
  to: number;
  limit: number;
  order: "asc" | "desc";
}

export class Anedya_GetData_Req implements _IAnedya_GetData_Req {
  constructor(
    public variable: string,
    public from: number,
    public to: number,
    public limit: number = 10000,
    public order: "asc" | "desc" = "desc",
  ) {
    if (order !== "asc" && order !== "desc") {
      throw new Error("Invalid order value. It should be either 'asc' or 'desc'.");
    }
    if (limit < 1) {
      throw new Error("Invalid limit value. It should be at least 1.");
    }
    if (from > to) {
      throw new Error("Invalid time range. 'from' should be less than or equal to 'to'.");
    }
  }
}

export interface IAnedya_GetData_Resp {
  isSuccess?: boolean;
  isDataAvailable?: boolean;
  data?: _ITimeSeriesData | null;
  count?: number;
  startTime?: number;
  endTime?: number;
  error?: string;
}
export class Anedya_GetData_Resp implements IAnedya_GetData_Resp {
  constructor(
    public isSuccess: boolean=false,
    public isDataAvailable: boolean=false,
    public data: _ITimeSeriesData | null,
    public error: string,
    public count: number,
    public startTime: number,
    public endTime: number,
  ) {
    this.isSuccess = isSuccess;
    this.isDataAvailable = isDataAvailable;
    this.data = data;
    this.count = count;
    this.startTime = startTime;
    this.endTime = endTime;
    this.error = error;
  }
}

// ------------ Get Latest Data ------------
export interface _IAnedya_GetLatestData_Req {
  variable: string;
}


export interface IAnedya_GetLatestData_Resp {
  isSuccess?: boolean;
  isDataAvailable?: boolean;
  data?: _ITimeSeriesData | null;
  error?: string;
}

export class Anedya_GetlatestData_Resp implements IAnedya_GetLatestData_Resp {
  constructor(
    public isSuccess: boolean = false,
    public isDataAvailable: boolean=false,
    public data: _ITimeSeriesData | null,
    public error: string
  ) {
    this.isSuccess = isSuccess;
    this.isDataAvailable = isDataAvailable;
    this.data = data;
    this.error = error;
  }
}
