const fetch = require('node-fetch');

async function testLlama() {
  const prompt = `You are a dietary supplement formulation expert. Based on public knowledge and typical formulations, estimate the ingredients in the following product:

Product name: Gorilla Mode Pre-Workout  
Brand: Gorilla Mind

Only list ingredients. If you are unsure, say so. Do not invent proprietary blends or make up fake details.`;

  console.log('🚀 Sending request to OpenRouter...');

  try {
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3-8b-instruct',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      },
    );

    const data = await response.json();
    console.log('✅ Raw Response:', JSON.stringify(data, null, 2));

    if (data.choices && data.choices[0]?.message) {
      console.log('\n📋 AI Response:');
      console.log('--------------------');
      console.log(data.choices[0].message.content);
      console.log('--------------------');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Set a timeout of 30 seconds
const timeoutPromise = new Promise((_, reject) =>
  setTimeout(
    () => reject(new Error('Request timed out after 30 seconds')),
    30000,
  ),
);

console.log('Starting test (max 30 seconds)...');
Promise.race([testLlama(), timeoutPromise]).catch((err) =>
  console.error('❌', err.message),
);
