"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockStorageProvider = void 0;
const errors_js_1 = require("../../../utils/errors.js");
class MockStorageProvider {
    async generateUploadTicket(_req) {
        throw new errors_js_1.ServiceUnavailableError('Image storage is not configured.');
    }
    async getSignedDownloadUrl(_storageKey) {
        throw new errors_js_1.ServiceUnavailableError('Image storage is not configured.');
    }
    async deleteObject(_storageKey) {
        throw new errors_js_1.ServiceUnavailableError('Image storage is not configured.');
    }
}
exports.MockStorageProvider = MockStorageProvider;
