// /api/aif-waitlist.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    name,
    email,
    company,
    role,
    industry,
    motivations,
    enterpriseInterest,
    consent,
  } = req.body;

  if (!name || !email || !industry || !consent) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const motivationList = motivations
    ? Object.keys(motivations).filter((label) => motivations[label])
    : [];

  const NOTION_TOKEN = process.env.NOTION_TOKEN;
  const DATABASE_ID = process.env.NOTION_AIF_WAITLIST_DB_ID;

  // Build the properties dynamically to avoid 'undefined' keys
  const properties = {
    'Name': { title: [{ text: { content: name } }] },
    'Email': { email: email },
    'Enterprise Interest': { checkbox: !!enterpriseInterest },
    'Consent': { checkbox: !!consent },
    'Submitted At': { date: { start: new Date().toISOString() } },
  };

  if (company && company.trim() !== '') {
    properties['Company'] = { rich_text: [{ text: { content: company } }] };
  }

  if (role && role.trim() !== '') {
    properties['Role'] = { rich_text: [{ text: { content: role } }] };
  }

  if (industry && industry.trim() !== '') {
    properties['Industry'] = { select: { name: industry } };
  }

  if (motivationList.length > 0) {
    properties['Motivations'] = {
      multi_select: motivationList.map((m) => ({ name: m })),
    };
  }

  try {
    const notionRes = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { database_id: DATABASE_ID },
        properties: properties,
      }),
    });

    if (!notionRes.ok) {
      const errBody = await notionRes.text();
      console.error('NOTION ERROR LOG:', errBody);
      // Return 400 + Notion's exact error message so you can see what failed in the Network tab
      return res.status(400).json({ error: 'Notion rejected request', details: JSON.parse(errBody) });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}