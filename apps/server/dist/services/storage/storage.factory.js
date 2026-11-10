"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageFactory = void 0;
const mock_provider_js_1 = require("./providers/mock.provider.js");
class StorageFactory {
    static instance;
    static getProvider() {
        if (!this.instance) {
            this.instance = new mock_provider_js_1.MockStorageProvider();
        }
        return this.instance;
    }
}
exports.StorageFactory = StorageFactory;
