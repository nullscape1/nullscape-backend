import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isValidObjectId } from './objectId.js';

test('isValidObjectId false for invalid', () => {
  assert.equal(isValidObjectId(''), false);
  assert.equal(isValidObjectId('not-an-id'), false);
});

test('isValidObjectId true for 24-char hex', () => {
  assert.equal(isValidObjectId('507f1f77bcf86cd799439011'), true);
});
