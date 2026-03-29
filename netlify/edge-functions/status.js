export default async () => {
  let accepting = true;

  try {
    const sheetId = Deno.env.get('GOOGLE_SHEET_ID');
    const apiKey  = Deno.env.get('GOOGLE_SHEETS_API_KEY');
    const url     = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A:B?key=${apiKey}`;

    const res  = await fetch(url);
    const data = await res.json();
    const rows = data.values || [];

    const row = rows.find(r => r[0] === 'accepting_new_patients');
    if (row) accepting = row[1].trim().toLowerCase() !== 'false';
  } catch (_) {
    // default to accepting if sheet is unreachable
  }

  return new Response(
    JSON.stringify({ acceptingNewPatients: accepting }),
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
