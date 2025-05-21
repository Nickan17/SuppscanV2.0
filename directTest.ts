const OPENROUTER_API_KEY =
  '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';

async function testPrompt() {
  try {
    const prompt = `List the active ingredients in Gorilla Mode Pre-Workout by Gorilla Mind. Just list them in bullet points.`;

    console.log('Sending prompt to OpenRouter...');

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'You are a helpful assistant that provides accurate and concise information.',
            },
            { role: 'user', content: prompt },
          ],
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('\n=== Response from OpenRouter ===');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(
      'Error:',
      error instanceof Error ? error.message : String(error),
    );
  } finally {
    process.exit(0);
  }
}

testPrompt();
