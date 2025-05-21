const fetch = require('node-fetch');

const API_KEY =
  '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';
const PROMPT = `List the ingredients in Gorilla Mode Pre-Workout by Gorilla Mind. For each, include the form and typical dosage. Format each line as:
- Ingredient Name (Form): Dosage

Example:
- Citrulline Malate (2:1): 6000 mg
- Beta-Alanine: 3200 mg

Only list ingredients that are known to be in this product. Be concise and specific.`;

async function test() {
  try {
    console.log('Sending request to OpenRouter...');

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo',
          max_tokens: 1000,
          messages: [
            {
              role: 'system',
              content:
                'You are a helpful assistant that provides accurate and detailed information.',
            },
            { role: 'user', content: PROMPT },
          ],
        }),
      },
    );

    if (!response.ok) {
      console.error('Error status:', response.status);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return;
    }

    const data = await response.json();
    console.log('\n=== Response ===');
    if (data.choices && data.choices[0] && data.choices[0].message) {
      console.log(data.choices[0].message.content);
    } else {
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
