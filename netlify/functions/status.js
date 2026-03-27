exports.handler = async () => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    },
    body: JSON.stringify({
      acceptingNewPatients: process.env.ACCEPTING_NEW_PATIENTS !== 'false'
    })
  };
};
