import test from 'node:test';
import assert from 'node:assert/strict';
import { products, origins, levelFor, durationFor } from './products.js';
test('todos os produtos têm uma origem válida e as três categorias estão presentes', () => {
  assert.equal(new Set(products.map(p => p.name)).size, products.length);
  for (const p of products) { assert.ok(p.name && p.icon); assert.ok(origins[p.origin]); }
  assert.equal(new Set(products.map(p => p.origin)).size, 3);
});
test('cinco acertos aumentam o nível e a queda acelera com limite jogável', () => {
  assert.equal(levelFor(4), 1); assert.equal(levelFor(5), 2); assert.equal(levelFor(10), 3);
  assert.ok(durationFor(2) < durationFor(1)); assert.equal(durationFor(100), 1500);
});
