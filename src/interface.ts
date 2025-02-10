export interface IConfigHeaders {
  tokenId: string;
  tokenBytes: Uint8Array;
  signatureVersion: string;
  signatureVersionBytes: Uint8Array;
  authorizationMode: string;
}
