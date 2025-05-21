// Set up environment variables
(global as any).__DEV__ = process.env.NODE_ENV === 'development';

import { OpenRouterService } from './services/openRouter';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testPrompt() {
  if (!process.env.OPENROUTER_API_KEY) {
    console.error('Error: OPENROUTER_API_KEY environment variable is not set');
    process.exit(1);
  }
  try {
    console.log('Sending prompt to OpenRouter...');

    // Use the OpenRouterService with the specified prompt
    const result = await OpenRouterService.evaluateSupplement({
      productName: 'Gorilla Mode Pre-Workout',
      brand: 'Gorilla Mind',
      ingredients: `You are a world-class supplement formulation expert. Based on public knowledge and typical formulations, estimate the ingredients in the following product:

Product name: Gorilla Mode Pre-Workout  
Brand: Gorilla Mind

Only list ingredients. If you are unsure, say so. Do not make up claims or proprietary blends.`,
      categories: 'Pre-Workout Supplement',
    });

    console.log('\n=== Response from OpenRouter ===');
    console.log('Score:', result.score);
    console.log('Summary:', result.summary);
    console.log('\nIngredients:');
    result.ingredients.forEach((ing) => console.log(`- ${ing}`));

    console.log('\nCategory Breakdown:');
    Object.entries(result.category_breakdown).forEach(([category, data]) => {
      console.log(`- ${category}: ${data.score}/10 - ${data.reason}`);
    });
  } catch (error) {
    console.error(
      'Error:',
      error instanceof Error ? error.message : String(error),
    );
  }
}

// Run the test
testPrompt()
  .catch(console.error)
  .finally(() => process.exit(0));
