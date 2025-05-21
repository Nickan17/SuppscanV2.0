import { OpenRouterService } from './services/openRouter';

async function testLlamaFallback() {
  const prompt = `You are a dietary supplement formulation expert. Based on public knowledge and typical formulations, estimate the ingredients in the following product:

Product name: Gorilla Mode Pre-Workout  
Brand: Gorilla Mind

Only list ingredients. If you are unsure, say so. Do not invent proprietary blends or make up fake details.`;

  console.log('🚀 Sending request to OpenRouter...');
  console.log('📝 Prompt:', prompt);

  try {
    const response = await OpenRouterService.evaluateSupplement({
      productName: 'Gorilla Mode Pre-Workout',
      brand: 'Gorilla Mind',
      ingredients: '',
      categories: 'Pre-Workout',
      model: 'meta-llama/llama-3-8b-instruct',
      customPrompt: prompt,
    });

    console.log('✅ Raw AI Response:', JSON.stringify(response, null, 2));

    if (response && response.summary) {
      console.log('\n📋 Formatted Response:');
      console.log('--------------------');
      console.log(response.summary);
      console.log('--------------------');
    }

    return response;
  } catch (error) {
    console.error('❌ Error calling OpenRouter:', error);
    throw error;
  }
}

// Run the test
testLlamaFallback()
  .then(() => console.log('\nTest completed!'))
  .catch(console.error);
