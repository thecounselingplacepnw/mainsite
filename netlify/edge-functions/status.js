export default async () => {
  let accepting = true;
  let debug = {};

  try {
    const sheetId = Deno.env.get('GOOGLE_SHEET_ID');
    const apiKey  = Deno.env.get('GOOGLE_SHEETS_API_KEY');
    debug.sheetId = sheetId ? sheetId.slice(0, 8) + '...' : 'MISSING';
    debug.apiKey  = apiKey  ? apiKey.slice(0, 6)  + '...' : 'MISSING';

    const url  = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A:B?key=${apiKey}`;
    const res  = await fetch(url);
    const data = await res.json();
    debug.status = res.status;
    debug.rows   = data.values || [];
    debug.error  = data.error  || null;

    const row = debug.rows.find(r => r[0] === 'accepting_new_patients');
    debug.matchedRow = row || null;
    if (row) accepting = row[1].trim().toLowerCase() !== 'false';
  } catch (e) {
    debug.exception = e.message;
    console.error('[status] fetch failed:', e.message);
  }

  console.log('[status] result:', JSON.stringify({ accepting, ...debug }));

  return new Response(
    JSON.stringify({ acceptingNewPatients: accepting, debug }),
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
