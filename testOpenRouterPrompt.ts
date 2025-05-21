import { OpenRouterService } from './services/openRouter';

async function testPrompt() {
  try {
    console.log('Sending prompt to OpenRouter...');

    const response = await OpenRouterService.evaluateSupplement({
      productName: 'Gorilla Mode Pre-Workout',
      brand: 'Gorilla Mind',
      ingredients:
        'You are a dietary supplement formulation expert. Based on public knowledge and typical formulations, estimate the ingredients in the following product:\n\nProduct name: Gorilla Mode Pre-Workout  \nBrand: Gorilla Mind\n\nOnly list ingredients. If unsure, say so. Do not make up proprietary blends or fake claims.',
    });

    console.log('\nResponse from OpenRouter:');
    console.log('----------------------');
    console.log('Score:', response.score);
    console.log('Summary:', response.summary);
    console.log('Ingredients:', response.ingredients.join(', '));
    console.log('\nCategory Breakdown:');
    Object.entries(response.category_breakdown).forEach(([category, data]) => {
      console.log(`- ${category}: ${data.score}/10 - ${data.reason}`);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

testPrompt();
