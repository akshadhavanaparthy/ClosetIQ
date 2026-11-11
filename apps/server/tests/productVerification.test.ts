import assert from 'node:assert/strict';
import test from 'node:test';
import { isCatalogVerificationCurrent } from '../src/services/catalog/productVerification.js';

test('catalog verification stops authorizing a listing after 24 hours', () => {
  const now = Date.now();
  assert.equal(isCatalogVerificationCurrent(new Date(now - 23 * 60 * 60 * 1000), now), true);
  assert.equal(isCatalogVerificationCurrent(new Date(now - 25 * 60 * 60 * 1000), now), false);
  assert.equal(isCatalogVerificationCurrent(null, now), false);
});
