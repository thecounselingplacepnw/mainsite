export default async () => {
  const accepting = Deno.env.get('ACCEPTING_NEW_PATIENTS') !== 'false';
  return new Response(
    JSON.stringify({ acceptingNewPatients: accepting }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    }
  );
};

export const config = { path: '/api/status' };
