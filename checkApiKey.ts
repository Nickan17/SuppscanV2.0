const OPENROUTER_API_KEY =
  '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';

async function checkApiKey() {
  try {
    console.log('Checking API key...');

    const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      },
    });

    console.log(`Status: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      console.log('API Key Info:', JSON.stringify(data, null, 2));
    } else {
      const error = await response.text();
      console.error('Error:', error);
    }
  } catch (error) {
    console.error(
      'Error:',
      error instanceof Error ? error.message : String(error),
    );
  } finally {
    process.exit(0);
  }
}

checkApiKey();
