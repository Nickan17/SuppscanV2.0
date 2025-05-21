import { config } from '../config';

export interface EvaluationResult {
  score: number;
  summary: string;
  ingredients: string[];
  category_breakdown: Record<string, { score: number; reason: string }>;
}

// Deprecation notice for direct env access
if (!config.openRouter.apiKey) {
  console.warn(
    'OpenRouter API key not found. Using mock data for evaluations.',
  );
}

export class OpenRouterService {
  static async evaluateSupplement(params: {
    productName: string;
    brand: string;
    ingredients: string;
    categories?: string;
    model?: string;
  }): Promise<EvaluationResult> {
    try {
      const prompt = this.createEvaluationPrompt(params);

      // Use mock data in development or if no API key is provided
      if (config.isDev || !config.openRouter.apiKey) {
        console.warn('Using mock evaluation data');
        return this.getMockEvaluation(params);
      }

      const response = await fetch(config.openRouter.apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.openRouter.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://your-site.com',
          'X-Title': 'Supplement Scanner',
        },
        body: JSON.stringify({
          model: params.model || 'meta-llama/llama-3-8b-instruct',
          messages: [
            {
              role: 'system',
              content:
                'You are a helpful assistant that evaluates nutritional supplements.',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || 'Failed to evaluate supplement',
        );
      }

      const data = await response.json();
      const resultText = data.choices[0]?.message?.content || '{}';

      let result: EvaluationResult;
      try {
        result = JSON.parse(resultText);
      } catch (e) {
        console.error('Failed to parse AI response:', resultText);
        throw new Error('Invalid response format from AI');
      }

      // Validate the response structure
      if (
        typeof result.score !== 'number' ||
        typeof result.summary !== 'string' ||
        !Array.isArray(result.ingredients) ||
        typeof result.category_breakdown !== 'object'
      ) {
        console.error('Invalid response structure:', result);
        throw new Error('Invalid response structure from AI');
      }

      return result;
    } catch (error) {
      console.error('Error in OpenRouter evaluation:', error);

      // Return mock data if in development or if API fails
      console.warn('Falling back to mock evaluation data');
      return this.getMockEvaluation(params);
    }
  }

  private static createEvaluationPrompt(params: {
    productName: string;
    brand: string;
    ingredients: string;
    categories?: string;
  }): string {
    return `Evaluate this supplement and provide a detailed analysis in JSON format with the following structure:
    {
      "score": number (0-100),
      "summary": "A brief summary of the supplement's quality",
      "ingredients": ["list", "of", "key", "ingredients"],
      "category_breakdown": {
        "Purity": { "score": number (0-10), "reason": "Detailed reason" },
        "Effectiveness": { "score": number (0-10), "reason": "Detailed reason" },
        "Safety": { "score": number (0-10), "reason": "Detailed reason" },
        "Value": { "score": number (0-10), "reason": "Detailed reason" }
      }
    }
    
    Product: ${params.productName}
    Brand: ${params.brand}
    Categories: ${params.categories || 'N/A'}
    Ingredients: ${params.ingredients || 'Not specified'}
    
    Be critical and thorough in your evaluation. Consider potential allergens, fillers, and the quality of ingredients.`;
  }

  private static getMockEvaluation(params: {
    productName: string;
    brand: string;
    model?: string;
  }): EvaluationResult {
    // This is just for development/demo purposes
    const mockScores = {
      Purity: Math.floor(Math.random() * 10) + 1,
      Effectiveness: Math.floor(Math.random() * 10) + 1,
      Safety: Math.floor(Math.random() * 10) + 1,
      Value: Math.floor(Math.random() * 10) + 1,
    };

    const avgScore =
      ((mockScores.Purity +
        mockScores.Effectiveness +
        mockScores.Safety +
        mockScores.Value) /
        4) *
      10;

    return {
      score: Math.min(100, Math.round(avgScore)),
      summary: `This is a mock evaluation for ${params.productName} by ${params.brand}. In a real implementation, this would be an AI-generated analysis.`,
      ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'],
      category_breakdown: {
        Purity: {
          score: mockScores.Purity,
          reason: 'Mock evaluation - actual analysis would appear here.',
        },
        Effectiveness: {
          score: mockScores.Effectiveness,
          reason: 'Mock evaluation - actual analysis would appear here.',
        },
        Safety: {
          score: mockScores.Safety,
          reason: 'Mock evaluation - actual analysis would appear here.',
        },
        Value: {
          score: mockScores.Value,
          reason: 'Mock evaluation - actual analysis would appear here.',
        },
      },
    };
  }
}
