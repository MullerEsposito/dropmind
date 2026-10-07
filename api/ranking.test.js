import test from 'node:test';
import assert from 'node:assert/strict';
import handler from './ranking.js';

test('ranking API validates input, reads shared scores, writes atomically and reports outages', async () => {
  const originalFetch = globalThis.fetch;
  const previousURL = process.env.UPSTASH_REDIS_REST_URL, previousToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  const previousKVURL = process.env.KV_REST_API_URL, previousKVToken = process.env.KV_REST_API_TOKEN;
  async function request(method, body) {
    const res = { headers: {}, setHeader(k, v) { this.headers[k] = v; }, end(value) { this.body = JSON.parse(value); } };
    await handler({ method, body }, res); return res;
  }
  try {
    delete process.env.UPSTASH_REDIS_REST_URL; delete process.env.UPSTASH_REDIS_REST_TOKEN; delete process.env.KV_REST_API_URL; delete process.env.KV_REST_API_TOKEN;
    assert.equal((await request('GET')).statusCode, 503);
    process.env.UPSTASH_REDIS_REST_URL = 'https://redis.example.test'; process.env.UPSTASH_REDIS_REST_TOKEN = 'test-only';
    let command;
    globalThis.fetch = async (_, options) => { command = JSON.parse(options.body); return { ok: true, json: async () => ({ result: [JSON.stringify({ name: 'Lucca' }), '120', JSON.stringify({ name: 'Pietro' }), '90'] }) }; };
    const read = await request('GET'); assert.equal(read.statusCode, 200); assert.deepEqual(read.body.ranking, [{ name: 'Lucca', score: 120 }, { name: 'Pietro', score: 90 }]);
    assert.equal(command[0], 'ZREVRANGE');
    assert.equal((await request('POST', { name: 'Lucca', score: -10 })).statusCode, 400);
    assert.equal((await request('POST', { name: 'Lucca', score: 15 })).statusCode, 400);
    assert.equal((await request('POST', { name: ' ', score: 10 })).statusCode, 400);
    assert.equal((await request('POST', { name: 'Pietro', score: 90, id: '00000000-0000-4000-8000-000000000001' })).statusCode, 200);
    assert.equal(command[0], 'EVAL'); assert.match(command[1], /ZADD.*NX/); assert.match(command[1], /ZREMRANGEBYRANK/);
    globalThis.fetch = async () => { throw Error('offline'); };
    assert.equal((await request('GET')).statusCode, 502);
    assert.equal((await request('DELETE')).statusCode, 405);
  } finally {
    globalThis.fetch = originalFetch;
    for (const [name, value] of Object.entries({ UPSTASH_REDIS_REST_URL: previousURL, UPSTASH_REDIS_REST_TOKEN: previousToken, KV_REST_API_URL: previousKVURL, KV_REST_API_TOKEN: previousKVToken })) { if (value === undefined) delete process.env[name]; else process.env[name] = value; }
  }
});
