// /api/waitlist.js
// Receives waitlist form submissions and writes them to the
// "Women's Alliance Waitlist" database in Notion.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    name,
    email,
    firm,
    role,
    specialty,
    motivations,        // object: { "label text": true/false }
    enterpriseInterest, // boolean
    consent,             // boolean
  } = req.body;

  // Basic required-field validation, mirrors the required fields in the form
  if (!name || !email || !role || !specialty || !consent) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Convert the { label: true/false } motivations map into an array of
  // checked labels, since Notion's multi_select wants a plain array.
  const motivationList = motivations
    ? Object.keys(motivations).filter((label) => motivations[label])
    : [];

  const NOTION_TOKEN = process.env.NOTION_TOKEN;
  const DATABASE_ID = process.env.NOTION_WAITLIST_DB_ID;

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
        properties: {
          'Name': { title: [{ text: { content: name } }] },
          'Email': { email: email },
          'Company': firm ? { rich_text: [{ text: { content: firm } }] } : undefined,
          'Role': role ? { select: { name: role } } : undefined,
          'Specialty': specialty ? { select: { name: specialty } } : undefined,
          'Motivations': motivationList.length
            ? { multi_select: motivationList.map((m) => ({ name: m })) }
            : undefined,
          'Enterprise Interest': { checkbox: !!enterpriseInterest },
          'Consent': { checkbox: !!consent },
          'Submitted At': { date: { start: new Date().toISOString() } },
        },
      }),
    });

    if (!notionRes.ok) {
      const errBody = await notionRes.text();
      console.error('Notion API error:', errBody);
      return res.status(502).json({ error: 'Failed to save signup' });
    }

    // Send a confirmation email. This runs after the Notion save succeeds,
    // and a failure here does NOT fail the whole submission — the signup
    // is already safely recorded either way. We just log it so it's
    // visible in Vercel's Logs tab if it ever needs troubleshooting.
    try {
      const RESEND_API_KEY = process.env.RESEND_API_KEY;
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Ponder <hello@thepresentco.com>',
          reply_to: 'jponder@thepresentco.com',
          to: [email],
          subject: "You're on the Ponder AI Fundamentals waitlist",
          html: `
            <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:32px;color:#1a1410;">
              <div style="font-family:Georgia,serif;font-weight:bold;font-size:22px;margin-bottom:24px;">
                Ponder<span style="color:#b8943f;">.</span>
              </div>
              <p style="font-size:16px;line-height:1.6;">Hi ${name.split(' ')[0]},</p>
              <p style="font-size:16px;line-height:1.6;">
                You're on the waitlist for Ponder AI Fundamentals (AIF), and Women's Alliance of
                Financial Advisors members get the first look.
              </p>
              <p style="font-size:16px;line-height:1.6;">
                AIF is a free, plain-language course in AI risk mitigation. It teaches you to check
                whether an AI tool does what its maker promises, document your due diligence, and
                limit your liability and your clients' exposure when AI goes wrong.
              </p>
              <p style="font-size:16px;line-height:1.6;">
                The full course opens all at once, with all five units and the final exam. We'll email
                you the day it opens, along with details on the member webinar on responsible AI we're
                planning with Women's Alliance.
              </p>
              <p style="font-size:16px;line-height:1.6;">
                Until then, you can try the Unit 1 preview any time:
                <a href="https://www.thisisponder.com/demo/" style="color:#7F6120;">thisisponder.com/demo</a>
              </p>
              <p style="font-size:16px;line-height:1.6;margin-top:24px;">
                — Jeanette Ponder<br>
                Founder &amp; CEO, The Present Company
              </p>
            </div>
          `,
        }),
      });

      if (!emailRes.ok) {
        const errBody = await emailRes.text();
        console.error('Resend API error:', errBody);
      }
    } catch (emailErr) {
      console.error('Confirmation email failed to send:', emailErr);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Waitlist submission error:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
