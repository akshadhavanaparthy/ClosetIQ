import { randomUUID } from 'crypto';
import { IStorageService, UploadTicketRequest, UploadTicketResponse } from '../storage.interface.js';

export class MockStorageProvider implements IStorageService {
  async generateUploadTicket(req: UploadTicketRequest): Promise<UploadTicketResponse> {
    const ext = req.fileName.split('.').pop() || 'webp';
    const storageKey = `${req.category.toLowerCase()}/${req.userId}/${randomUUID()}.${ext}`;

    return {
      uploadUrl: `https://mock-storage.closetiq.fashion/upload?key=${storageKey}&token=${randomUUID()}`,
      storageKey,
      publicUrl: '',
      expiresInSeconds: 900,
    };
  }

  async getSignedDownloadUrl(storageKey: string): Promise<string> {
    return `https://mock-storage.closetiq.fashion/${storageKey}?signature=${randomUUID()}`;
  }

  async deleteObject(_storageKey: string): Promise<void> {
    // No-op for mock
  }
}
