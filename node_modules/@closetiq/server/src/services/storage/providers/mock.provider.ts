import { IStorageService, UploadTicketRequest, UploadTicketResponse } from '../storage.interface.js';
import { ServiceUnavailableError } from '../../../utils/errors.js';

export class MockStorageProvider implements IStorageService {
  async generateUploadTicket(_req: UploadTicketRequest): Promise<UploadTicketResponse> {
    throw new ServiceUnavailableError('Image storage is not configured.');
  }

  async getSignedDownloadUrl(_storageKey: string): Promise<string> {
    throw new ServiceUnavailableError('Image storage is not configured.');
  }

  async deleteObject(_storageKey: string): Promise<void> {
    throw new ServiceUnavailableError('Image storage is not configured.');
  }
}
