export const apiConfig = {
 
};

export interface INewConfig {
  tokenId: string;
  token: string;
  testMode?: boolean;
}

export class NewConfig implements INewConfig {
  tokenId: string;
  token: string;
  baseUrl:string;


  constructor(tokenId: string, token: string, testMode: boolean=false) {

    if (!tokenId || tokenId.trim() === '') {
      throw new Error('Token ID is required');
    }
    if (!token || token.trim() === '') {
      throw new Error('Token is required');
    }
    this.tokenId = tokenId;
    this.token = token;
    if(testMode){
      this.baseUrl='https://stageapi.anedya.io/v1'
    }else{
      this.baseUrl='https://api.anedya.io/v1'
    }
  }
}



