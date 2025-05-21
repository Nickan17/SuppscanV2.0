const OPENROUTER_API_KEY =
  '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';

async function testGorillaMode() {
  try {
    console.log('Sending request to OpenRouter...');

    const prompt = `You are a dietary supplement formulation expert with extensive knowledge of pre-workout supplements and their formulations. Based on your training data and knowledge, please provide a detailed and accurate estimated ingredient panel for Gorilla Mode Pre-Workout by Gorilla Mind.

For each ingredient, please include:
1. The full ingredient name
2. The specific form (e.g., Citrulline Malate 2:1, Beta-Alanine, etc.)
3. The typical dosage per serving in milligrams (mg)

Format your response as follows:
- Ingredient Name (Form): Dosage

Example:
- Citrulline Malate (2:1): 6000 mg
- Beta-Alanine: 3200 mg
- Alpha-GPC (50%): 300 mg
- L-Tyrosine: 1000 mg
- Caffeine Anhydrous: 200 mg

Please only include ingredients that are commonly found in pre-workout supplements and are likely to be in this specific product. If you're uncertain about any ingredient or dosage, please indicate that with a question mark (?).`;

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3-8b-instruct',
          messages: [
            {
              role: 'system',
              content:
                'You are a dietary supplement formulation expert with extensive knowledge of pre-workout supplements. Provide only the ingredient list in the requested format, with no additional commentary.',
            },
            {
              role: 'user',
              content:
                'List all ingredients in Gorilla Mode Pre-Workout by Gorilla Mind with their forms and dosages in the exact format: "- Ingredient Name (Form): Dosage". Only include ingredients you are certain about.',
            },
          ],
          temperature: 0.3,
          max_tokens: 1000,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Save the full response to a file
    const fs = require('fs');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `gorilla_mode_response_${timestamp}.json`;

    // Save the full response
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));

    // Save just the message content to a text file for easier reading
    const content = data.choices?.[0]?.message?.content || 'No content';
    fs.writeFileSync('gorilla_mode_ingredients.txt', content);

    console.log('\n=== Response Summary ===');
    console.log(`Model: ${data.model}`);
    console.log(
      `Tokens: ${data.usage?.total_tokens} (Prompt: ${data.usage?.prompt_tokens}, Completion: ${data.usage?.completion_tokens})`,
    );
    console.log('\n=== Ingredient List ===');
    console.log(content);
    console.log(`\nFull response saved to: ${filename}`);
    console.log('Ingredient list saved to: gorilla_mode_ingredients.txt');
  } catch (error) {
    console.error(
      'Error:',
      error instanceof Error ? error.message : String(error),
    );
  } finally {
    process.exit(0);
  }
}

testGorillaMode();
