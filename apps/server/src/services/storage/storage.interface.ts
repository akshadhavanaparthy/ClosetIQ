export interface UploadTicketRequest {
  fileName: string;
  mimeType: string;
  category: 'WARDROBE' | 'BODY_ANALYSIS' | 'PORTRAIT';
  userId: string;
}

export interface UploadTicketResponse {
  uploadUrl: string;
  storageKey: string;
  publicUrl: string;
  expiresInSeconds: number;
}

export interface IStorageService {
  generateUploadTicket(req: UploadTicketRequest): Promise<UploadTicketResponse>;
  getSignedDownloadUrl(storageKey: string, expiresInSeconds?: number): Promise<string>;
  deleteObject(storageKey: string): Promise<void>;
}
