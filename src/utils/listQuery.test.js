import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCrudListQuery } from './listQuery.js';

test('parseCrudListQuery caps limit and page', () => {
  const q = parseCrudListQuery({ page: '999999999', limit: '500', q: '  hi  ' });
  assert.equal(q.page, 1_000_000);
  assert.equal(q.limit, 100);
  assert.equal(q.q, 'hi');
});

test('parseCrudListQuery rejects oversize q via slice', () => {
  const long = 'a'.repeat(300);
  const q = parseCrudListQuery({ q: long });
  assert.equal(q.q?.length, 200);
});

test('parseCrudListQuery parses resolved boolean', () => {
  assert.equal(parseCrudListQuery({ resolved: 'true' }).resolved, true);
  assert.equal(parseCrudListQuery({ resolved: 'false' }).resolved, false);
});
