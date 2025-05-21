import { OpenRouterService } from './services/openRouter';

// Set up environment variables
(global as any).__DEV__ = process.env.NODE_ENV === 'development';

// Set the API key in the environment
process.env.OPENROUTER_API_KEY =
  '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';

async function testGorillaMode() {
  try {
    console.log('Testing Gorilla Mode Pre-Workout analysis...');

    const prompt = `You are a dietary supplement formulation expert with extensive knowledge of pre-workout supplements and their formulations. Based on your training data and knowledge, please provide a detailed and accurate estimated ingredient panel for the following product:

Product: Gorilla Mode Pre-Workout  
Brand: Gorilla Mind

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

    // Use the specified model: meta-llama/llama-4-scout:free
    const result = await OpenRouterService.evaluateSupplement({
      productName: 'Gorilla Mode Pre-Workout',
      brand: 'Gorilla Mind',
      ingredients: prompt,
      categories: 'Pre-Workout Supplement',
      model: 'meta-llama/llama-4-scout:free', // Using the specified model
    });

    console.log('\n=== Analysis Results ===');
    console.log('Score:', result.score);
    console.log('Summary:', result.summary);

    if (result.ingredients && result.ingredients.length > 0) {
      console.log('\nIngredients:');
      result.ingredients.forEach((ing: string) => console.log(`- ${ing}`));
    }

    if (result.category_breakdown) {
      console.log('\nCategory Breakdown:');
      Object.entries(result.category_breakdown).forEach(
        ([category, data]: [string, any]) => {
          console.log(`- ${category}: ${data.score}/10 - ${data.reason}`);
        },
      );
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

testGorillaMode();
