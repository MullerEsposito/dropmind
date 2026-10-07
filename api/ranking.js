import { randomUUID } from 'node:crypto';

const key = 'dropmind:ranking:v1';
const saveScript = "redis.call('ZADD', KEYS[1], 'NX', ARGV[1], ARGV[2]); redis.call('ZREMRANGEBYRANK', KEYS[1], 0, -11); return redis.call('ZREVRANGE', KEYS[1], 0, 9, 'WITHSCORES')";
export default async function ranking(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const send = (status, body) => { res.statusCode = status; res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.end(JSON.stringify(body)); };
  if (!['GET', 'POST'].includes(req.method)) { res.setHeader('Allow', 'GET, POST'); return send(405, { error: 'Método não permitido.' }); }
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN;
  if (!url || !token) return send(503, { error: 'O ranking global ainda não foi configurado.' });
  let command = ['ZREVRANGE', key, 0, 9, 'WITHSCORES'];
  if (req.method === 'POST') {
    let body;
    try {
      if (req.body !== undefined) body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      else { let raw = ''; for await (const chunk of req) { raw += chunk; if (raw.length > 2048) return send(413, { error: 'Dados muito grandes.' }); } body = JSON.parse(raw); }
    } catch { return send(400, { error: 'Dados inválidos.' }); }
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    if (!name || name.length > 24 || /[\x00-\x1f]/.test(name) || !Number.isSafeInteger(body.score) || body.score < 0 || body.score > 1000000 || body.score % 10 !== 0 || (body.id && !/^[a-f0-9-]{36}$/i.test(body.id))) return send(400, { error: 'Nome ou pontuação inválidos.' });
    const member = JSON.stringify({ id: body.id || randomUUID(), name });
    command = ['EVAL', saveScript, 1, key, body.score, member];
  }
  try {
    const response = await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(command), signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error('Redis unavailable');
    const data = await response.json();
    if (data.error || !Array.isArray(data.result)) throw new Error('Invalid Redis result');
    const entries = [];
    for (let i = 0; i < data.result.length; i += 2) { const entry = JSON.parse(data.result[i]); entries.push({ name: entry.name, score: Number(data.result[i + 1]) }); }
    return send(200, { ranking: entries });
  } catch { return send(502, { error: 'Não foi possível acessar o ranking. Tente novamente.' }); }
}
