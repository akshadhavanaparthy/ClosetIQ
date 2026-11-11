"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CATALOG_VERIFICATION_MAX_AGE_MS = void 0;
exports.catalogVerificationCutoff = catalogVerificationCutoff;
exports.isCatalogVerificationCurrent = isCatalogVerificationCurrent;
const shared_types_1 = require("@closetiq/shared-types");
exports.CATALOG_VERIFICATION_MAX_AGE_MS = shared_types_1.CATALOG_VERIFICATION_MAX_AGE_HOURS * 60 * 60 * 1000;
function catalogVerificationCutoff(now = Date.now()) {
    return new Date(now - exports.CATALOG_VERIFICATION_MAX_AGE_MS);
}
function isCatalogVerificationCurrent(verifiedAt, now = Date.now()) {
    return Boolean(verifiedAt && verifiedAt.getTime() >= now - exports.CATALOG_VERIFICATION_MAX_AGE_MS);
}
