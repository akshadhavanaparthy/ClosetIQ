"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockStorageProvider = void 0;
const crypto_1 = require("crypto");
class MockStorageProvider {
    async generateUploadTicket(req) {
        const ext = req.fileName.split('.').pop() || 'webp';
        const storageKey = `${req.category.toLowerCase()}/${req.userId}/${(0, crypto_1.randomUUID)()}.${ext}`;
        return {
            uploadUrl: `https://mock-storage.closetiq.fashion/upload?key=${storageKey}&token=${(0, crypto_1.randomUUID)()}`,
            storageKey,
            publicUrl: `https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80`,
            expiresInSeconds: 900,
        };
    }
    async getSignedDownloadUrl(storageKey) {
        return `https://mock-storage.closetiq.fashion/${storageKey}?signature=${(0, crypto_1.randomUUID)()}`;
    }
    async deleteObject(_storageKey) {
        // No-op for mock
    }
}
exports.MockStorageProvider = MockStorageProvider;
