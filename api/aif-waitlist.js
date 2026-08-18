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
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#0E0C0A;width:100%;margin:0;padding:40px 12px;table-layout:fixed;">
                <tr>
                  <td align="center" style="background-color:#0E0C0A;">
                    
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:520px;width:100%;background-color:#141210;border:1px solid #2E2820;">
                      
                      <tr>
                        <td style="padding:32px 32px 20px 32px;background-color:#141210;border-bottom:1px solid #2E2820;">
                          <div style="font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:bold;color:#F0EBE3;line-height:1;margin:0;">
                            Ponder<span style="color:#C4A46B;">.</span>
                          </div>
                          <div style="font-family:'Courier New',Courier,monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8A8070;margin-top:8px;">
                            AI Ethics Certification &bull; The Present Company
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:32px;background-color:#141210;">
                          
                          <p style="font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.6;color:#F0EBE3;margin:0 0 18px 0;font-style:italic;">
                            Hi ${name.split(' ')[0]},
                          </p>
                          
                          <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.6;color:#C8BFB0;margin:0 0 24px 0;">
                            You’re officially on the waitlist for <strong style="color:#F0EBE3;">AI Ethics Fundamentals (AIF)</strong>—a practitioner-first, scenario-based guide built specifically for the people actively deploying AI tools.
                          </p>

                          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#1E1A14;border-left:3px solid #C4A46B;margin:24px 0;">
                            <tr>
                              <td style="padding:16px 20px;background-color:#1E1A14;">
                                <div style="font-family:'Courier New',Courier,monospace;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#C4A46B;margin-bottom:4px;font-weight:bold;">
                                  Status
                                </div>
                                <div style="font-family:Georgia,'Times New Roman',serif;font-size:14px;color:#F0EBE3;font-weight:bold;">
                                  Waitlist Confirmed &bull; Launching Fall 2026
                                </div>
                              </td>
                            </tr>
                          </table>

                          <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.6;color:#C8BFB0;margin:0 0 28px 0;">
                            We will notify you directly the moment enrollment opens. No spam—just an exclusive invitation as soon as doors open.
                          </p>

                          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top:1px solid #2E2820;padding-top:20px;">
                            <tr>
                              <td style="background-color:#141210;">
                                <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.4;color:#F0EBE3;margin:0;font-weight:bold;">
                                  Jeanette Ponder
                                </p>
                                <p style="font-family:'Courier New',Courier,monospace;font-size:10px;letter-spacing:1px;text-transform:uppercase;color:#8A8070;margin:4px 0 0 0;">
                                  Founder &amp; CEO, The Present Company
                                </p>
                              </td>
                            </tr>
                          </table>

                        </td>
                      </tr>

                    </table>

                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:520px;margin-top:20px;">
                      <tr>
                        <td align="center" style="font-family:'Courier New',Courier,monospace;font-size:10px;color:#8A8070;line-height:1.6;">
                          &copy; 2026 The Present Company &bull; Chicago, IL<br>
                          <a href="https://www.thisisponder.com" style="color:#C4A46B;text-decoration:none;">thisisponder.com</a>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
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