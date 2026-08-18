// /api/aif-waitlist.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Ensure req.body is parsed as JSON
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }
  }

  const {
    name,
    email,
    company,
    role,
    industry,
    motivations,        // object: { "label text": true/false }
    enterpriseInterest, // boolean
    consent,            // boolean
  } = body || {};

  // Check which specific required field is missing
  if (!name) return res.status(400).json({ error: 'Missing field: name' });
  if (!email) return res.status(400).json({ error: 'Missing field: email' });
  if (!industry || industry.trim() === '') return res.status(400).json({ error: 'Missing field: industry' });
  if (!consent) return res.status(400).json({ error: 'Missing field: consent' });

  const motivationList = motivations
    ? Object.keys(motivations).filter((label) => motivations[label])
    : [];

  const NOTION_TOKEN = process.env.NOTION_AIF_TOKEN || process.env.NOTION_TOKEN;
  const DATABASE_ID = process.env.NOTION_AIF_WAITLIST_DB_ID;

  // Build Notion properties dynamically (prevents sending undefined values to Notion)
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
      console.error('Notion API error:', errBody);
      return res.status(502).json({ error: 'Notion API error', details: errBody });
    }

    // Confirmation Email via Resend
    try {
      const RESEND_API_KEY = process.env.RESEND_API_KEY;
      if (RESEND_API_KEY) {
        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Ponder <hello@thisisponder.com>',
            to: [email],
            subject: "You're on the AIF waitlist",
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <link rel="preconnect" href="https://fonts.googleapis.com">
                  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700&display=swap" rel="stylesheet">
                  <style>
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700&display=swap');
                  </style>
                </head>
                <body style="margin:0;padding:0;background-color:#0E0C0A;font-family:Georgia, 'Times New Roman', serif;color:#F0EBE3;-webkit-font-smoothing:antialiased;">
                  
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#0E0C0A;padding:48px 16px;">
                    <tr>
                      <td align="center">
                        
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:540px;background-color:#141210;border:1px solid #2E2820;border-radius:4px;overflow:hidden;">
                          
                          <tr>
                            <td style="padding:36px 40px 24px 40px;border-bottom:1px solid #2E2820;">
                              <div style="font-family:'Playfair Display', Georgia, serif;font-size:30px;font-weight:800;color:#F0EBE3;letter-spacing:-0.02em;line-height:1;">
                                Ponder<span style="color:#C4A46B;">.</span>
                              </div>
                              <div style="font-family:'Courier New', Courier, monospace;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#8A8070;margin-top:8px;">
                                AI Ethics Certification &bull; The Present Company
                              </div>
                            </td>
                          </tr>

                          <tr>
                            <td style="padding:36px 40px;">
                              
                              <p style="font-size:18px;line-height:1.6;color:#F0EBE3;margin:0 0 20px 0;font-style:italic;">
                                Hi ${name.split(' ')[0]},
                              </p>
                              
                              <p style="font-size:17px;line-height:1.7;color:#C8BFB0;margin:0 0 24px 0;font-style:italic;">
                                You’re officially on the waitlist for <strong style="color:#F0EBE3;font-style:normal;">AI Ethics Fundamentals (AIF)</strong>—a practitioner-first, scenario-based guide built specifically for the people actively deploying AI tools.
                              </p>

                              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#1E1A14;border-left:3px solid #C4A46B;border-radius:2px;margin:28px 0;">
                                <tr>
                                  <td style="padding:20px;">
                                    <div style="font-family:'Courier New', Courier, monospace;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#C4A46B;margin-bottom:6px;font-weight:600;">
                                      Status
                                    </div>
                                    <div style="font-size:15px;color:#F0EBE3;font-weight:600;">
                                      Waitlist Confirmed &bull; Launching Fall 2026
                                    </div>
                                  </td>
                                </tr>
                              </table>

                              <p style="font-size:16px;line-height:1.7;color:#C8BFB0;margin:0 0 36px 0;font-style:italic;">
                                We will notify you directly the moment enrollment opens. No spam—just an exclusive invitation as soon as doors open.
                              </p>

                              <div style="padding-top:24px;border-top:1px solid #2E2820;">
                                <p style="font-family:'Playfair Display', Georgia, serif;font-size:16px;line-height:1.4;color:#F0EBE3;margin:0;font-weight:700;">
                                  Jeanette Ponder
                                </p>
                                <p style="font-family:'Courier New', Courier, monospace;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#8A8070;margin:4px 0 0 0;">
                                  Founder &amp; CEO, The Present Company
                                </p>
                              </div>

                            </td>
                          </tr>

                        </table>

                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:540px;margin-top:28px;">
                          <tr>
                            <td align="center" style="font-family:'Courier New', Courier, monospace;font-size:10px;color:#8A8070;letter-spacing:0.05em;line-height:1.6;">
                              &copy; 2026 The Present Company &bull; Chicago, IL<br>
                              <a href="https://www.thisisponder.com" style="color:#C4A46B;text-decoration:none;">thisisponder.com</a>
                            </td>
                          </tr>
                        </table>

                      </td>
                    </tr>
                  </table>

                </body>
              </html>
            `,
          }),
        });

        if (!emailRes.ok) {
          const errBody = await emailRes.text();
          console.error('Resend API error:', errBody);
        }
      }
    } catch (emailErr) {
      console.error('Confirmation email error:', emailErr);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Waitlist submission error:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}