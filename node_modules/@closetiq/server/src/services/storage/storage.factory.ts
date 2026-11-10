import { IStorageService } from './storage.interface.js';
import { MockStorageProvider } from './providers/mock.provider.js';

export class StorageFactory {
  private static instance: IStorageService;

  public static getProvider(): IStorageService {
    if (!this.instance) {
      this.instance = new MockStorageProvider();
    }
    return this.instance;
  }
}
