export default async () => {
  let accepting    = true;
  let messageText  = 'Krissy is not currently accepting new clients. Existing clients can';
  let urlText      = 'still book via the portal';
  let url          = 'https://thecounselingplacepnw.clientsecure.me/sign-in';

  try {
    const sheetId = Deno.env.get('GOOGLE_SHEET_ID');
    const apiKey  = Deno.env.get('GOOGLE_SHEETS_API_KEY');
    const res     = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A:B?key=${apiKey}`);
    const data    = await res.json();
    const rows    = data.values || [];

    const get = key => {
      const row = rows.find(r => r[0].toLowerCase() === key.toLowerCase());
      return row ? row[1] : null;
    };

    const acceptingVal = get('accepting_new_patients');
    if (acceptingVal !== null) accepting = acceptingVal.trim().toLowerCase() !== 'false';
    messageText = get('messagetext') || messageText;
    urlText     = get('urltext')     || urlText;
    url         = get('url')         || url;
  } catch (_) {
    // defaults apply if sheet is unreachable
  }

  return new Response(
    JSON.stringify({ acceptingNewPatients: accepting, messageText, urlText, url }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Netlify-CDN-Cache-Control': 'no-store',
        'Surrogate-Control': 'no-store'
      }
    }
  );
};

export const config = { path: '/api/status' };
