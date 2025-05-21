// Simple test file that doesn't rely on the config

async function testPrompt() {
  try {
    console.log('Sending prompt to OpenRouter...');

    // Direct API call to OpenRouter
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer YOUR_OPENROUTER_API_KEY', // Removed for security
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://suppscan.test',
          'X-Title': 'Supplement Scanner Test',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3-8b-instruct',
          messages: [
            {
              role: 'system',
              content:
                'You are a helpful assistant that provides information about nutritional supplements.',
            },
            {
              role: 'user',
              content: `You are a dietary supplement formulation expert. Based on public knowledge and typical formulations, estimate the ingredients in the following product:

Product name: Gorilla Mode Pre-Workout  
Brand: Gorilla Mind

Only list ingredients. If you are unsure, say so. Do not make up claims or proprietary blends.`,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Full error response:', errorData);
      throw new Error(
        errorData.error?.message || 'Failed to get response from OpenRouter',
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || 'No content';

    console.log('\n=== Response from OpenRouter ===');
    console.log('Model:', data.model);
    console.log('Usage:', JSON.stringify(data.usage, null, 2));

    // Write the full response to a file for inspection
    const fs = require('fs');
    fs.writeFileSync('openrouter_response.json', JSON.stringify(data, null, 2));

    console.log('\n--- Content ---');
    console.log(content);
    console.log(
      '\n--- Raw response has been saved to openrouter_response.json ---',
    );
  } catch (error) {
    console.error(
      'Error:',
      error instanceof Error ? error.message : String(error),
    );
  }
}

// Run the test
testPrompt().catch(console.error);
