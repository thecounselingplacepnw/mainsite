export default async () => {
  const accepting = Deno.env.get('ACCEPTING_NEW_PATIENTS') !== 'false';
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
