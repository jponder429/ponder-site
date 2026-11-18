// Vercel serverless function: records anonymous Unit 1 demo metrics in Notion (Ponder Demo Metrics).
// Events: before-and-after confidence ratings and quiz attempts. No names, emails or free text.
// Requires env var NOTION_TOKEN, and the Notion integration must be connected to the Ponder Demo Metrics database.
const DATA_SOURCE_ID = process.env.NOTION_METRICS_DATA_SOURCE_ID || '41c76581-5812-81fa-b042-000b7ac14945';
const EVENTS = { pre: 'Confidence before', post: 'Confidence after', quiz: 'Quiz attempt' };

function int(v, min, max) {
  const n = Number(v);
  return Number.isInteger(n) && n >= min && n <= max ? n : null;
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const token = process.env.NOTION_TOKEN;
  if (req.method === 'GET') return res.status(200).json({ configured: Boolean(token) });
  if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return res.status(405).json({ ok: false, error: 'method' }); }
  if (!token) return res.status(503).json({ ok: false, error: 'not_configured' });

  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  b = b || {};

  const event = EVENTS[b.event];
  const session = String(b.sid || '').replace(/[^a-z0-9]/gi, '').slice(0, 24);
  if (!event || session.length < 8) return res.status(400).json({ ok: false, error: 'invalid' });

  const now = new Date().toISOString();
  const properties = {
    'Name': { title: [{ text: { content: event + ' · ' + session.slice(0, 6) } }] },
    'Event': { select: { name: event } },
    'Session': { rich_text: [{ text: { content: session } }] },
    'Page': { select: { name: 'Demo' } },
    'Submitted At': { date: { start: now } }
  };

  if (b.event === 'quiz') {
    const total = int(b.total, 1, 50);
    const score = total === null ? null : int(b.score, 0, total);
    const attempt = int(b.attempt, 1, 10);
    if (score === null || attempt === null) return res.status(400).json({ ok: false, error: 'invalid' });
    properties['Score'] = { number: score };
    properties['Total'] = { number: total };
    properties['Attempt'] = { number: attempt };
    properties['Passed'] = { checkbox: b.passed === true };
  } else {
    const value = int(b.value, 1, 5);
    if (value === null) return res.status(400).json({ ok: false, error: 'invalid' });
    properties['Confidence'] = { number: value };
  }

  try {
    const r = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token, 'Notion-Version': '2025-09-03', 'Content-Type': 'application/json' },
      body: JSON.stringify({ parent: { type: 'data_source_id', data_source_id: DATA_SOURCE_ID }, properties })
    });
    if (!r.ok) { console.error('metrics_notion_error', r.status, await r.text()); return res.status(502).json({ ok: false, error: 'upstream' }); }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('metrics_exception', e && e.message);
    return res.status(502).json({ ok: false, error: 'upstream' });
  }
};
