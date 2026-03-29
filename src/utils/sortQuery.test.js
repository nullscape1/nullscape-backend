import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseListSort } from './sortQuery.js';

const fields = new Set(['createdAt', 'title']);

test('parseListSort uses default for object input', () => {
  assert.equal(parseListSort({ $where: '1' }, '-createdAt', fields), '-createdAt');
});

test('parseListSort allows whitelisted field', () => {
  assert.equal(parseListSort('-title', '-createdAt', fields), '-title');
});

test('parseListSort rejects non-whitelisted field', () => {
  assert.equal(parseListSort('-evil', '-createdAt', fields), '-createdAt');
});

test('parseListSort rejects injection-like string', () => {
  assert.equal(parseListSort('-title;drop', '-createdAt', fields), '-createdAt');
});
