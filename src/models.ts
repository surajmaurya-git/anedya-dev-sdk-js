/* 
 * This file contains the models for the Anedya SDK.
 * It exports interfaces and classes that are used to represent the data
 * and requests for the Anedya API.
 *
*/
import {_ITimeSeriesData} from "./common_i";

// ============================== Data Access ==============================
// ------------ Get Data ------------
export interface _IAnedya_GetData_Req_Obj {
  variable: string;
  from: number;
  to: number;
  limit: number;
  order: "asc" | "desc";
}
/**
 * Request object for fetching data.
 */
export class Anedya_GetData_Req_Obj implements _IAnedya_GetData_Req_Obj {
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

export interface IAnedya_GetData_Resp_Obj {
  isSuccess?: boolean;
  isDataAvailable?: boolean;
  data?: _ITimeSeriesData | null;
  count?: number;
  startTime?: number;
  endTime?: number;
  error?: string;
}
/**
 * Response object for fetching data.
 */
export class Anedya_GetData_Resp_Obj implements IAnedya_GetData_Resp_Obj {
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
export interface _IAnedya_GetLatestData_Req_Obj {
  variable: string;
}


export interface IAnedya_GetLatestData_Resp_Obj {
  isSuccess?: boolean;
  isDataAvailable?: boolean;
  data?: _ITimeSeriesData | null;
  error?: string;
}
/**
 * Response object for fetching the latest data.
 */
export class Anedya_GetLatestData_Resp_Obj implements IAnedya_GetLatestData_Resp_Obj {
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
