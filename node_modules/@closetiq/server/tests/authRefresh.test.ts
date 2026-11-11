import test from 'node:test';
import assert from 'node:assert/strict';
import { signRefreshToken } from '../src/utils/jwt.js';

test('refresh token signing creates a unique token for every rotation', () => {
  const first = signRefreshToken('diagnostic-user');
  const second = signRefreshToken('diagnostic-user');

  assert.notEqual(first, second);
});
