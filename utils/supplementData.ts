import { Supplement, Ingredient, SupplementScores } from '@/types/supplement';

// Cache for storing product data to avoid redundant API calls
const productCache: Record<string, Supplement> = {};

/**
 * Fetches product data from OpenFoodFacts API
 */
async function fetchProductData(barcode: string): Promise<{
  product_name: string;
  brands?: string;
  categories?: string;
  image_url?: string;
  ingredients_text?: string;
}> {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
    );
    const data = await response.json();

    if (data.status === 0) {
      throw new Error('Product not found');
    }

    return data.product;
  } catch (error) {
    console.error('Error fetching product data:', error);
    throw error;
  }
}

/**
 * Analyzes ingredients using OpenRouter API
 */
async function analyzeIngredients(ingredients: string): Promise<{
  score: number;
  scores: SupplementScores;
  summary: string;
}> {
  try {
    // Skip analysis if ingredients are too short
    if (ingredients.length < 20) {
      throw new Error('Ingredients list is too short for analysis');
    }

    // In a real app, you would call the OpenRouter API here
    // This is a placeholder that simulates the API response
    return new Promise((resolve) => {
      setTimeout(() => {
        // This is a simplified example - in a real app, you'd parse the actual API response
        resolve({
          score: 85, // Example score
          scores: {
            clinicalDosing: 90,
            thirdPartyTesting: 80,
            brandTransparency: 85,
          },
          summary:
            'This is a sample analysis of the supplement ingredients. In a real app, this would be generated by the AI based on the actual ingredients.',
        });
      }, 1000);
    });
  } catch (error) {
    console.error('Error analyzing ingredients:', error);
    throw error;
  }
}

const dummySupplements: Supplement[] = [
  {
    id: 'DEMO123456',
    name: 'Vitamin D3 5000 IU',
    brand: "Nature's Way",
    category: 'Vitamins',
    imageUrl:
      'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    qualityScore: 88,
    scores: {
      clinicalDosing: 90,
      thirdPartyTesting: 95,
      brandTransparency: 80,
    },
    aiSummary:
      'This supplement contains 5000 IU of Vitamin D3 (cholecalciferol), which is a clinically supported dose for individuals with deficiency. The dose is well above the RDA of 600-800 IU but within safe limits for most adults. Research shows this dose can effectively raise blood levels in deficient individuals. This product uses olive oil as a carrier for better absorption since Vitamin D is fat-soluble. The supplement is third-party tested and uses quality ingredients with minimal fillers.',
    ingredients: [
      { name: 'Vitamin D3 (as Cholecalciferol)', dosage: '5000 IU' },
      { name: 'Olive Oil', dosage: '100 mg' },
      { name: 'Gelatin', dosage: '' },
      { name: 'Glycerin', dosage: '' },
    ],
  },
  {
    id: 'DEMO123457',
    name: 'Magnesium Glycinate',
    brand: 'Pure Encapsulations',
    category: 'Minerals',
    imageUrl:
      'https://images.pexels.com/photos/8105060/pexels-photo-8105060.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    qualityScore: 92,
    scores: {
      clinicalDosing: 95,
      thirdPartyTesting: 100,
      brandTransparency: 85,
    },
    aiSummary:
      "This magnesium glycinate supplement provides 120mg of elemental magnesium per capsule, which is a highly bioavailable form that's less likely to cause digestive distress. The clinical dose for magnesium is typically 200-400mg daily, so 2-3 capsules would meet recommended targets. Pure Encapsulations maintains excellent third-party testing standards and has clear transparency about their manufacturing process. The glycinate form is particularly effective for sleep, anxiety, and muscle recovery applications.",
    ingredients: [
      { name: 'Magnesium (as Magnesium Glycinate)', dosage: '120mg' },
      { name: 'Vegetable Cellulose', dosage: '' },
      { name: 'Ascorbyl Palmitate', dosage: '' },
    ],
  },
  {
    id: 'DEMO123458',
    name: 'Whey Protein Isolate',
    brand: 'Optimum Nutrition',
    category: 'Protein',
    imageUrl:
      'https://images.pexels.com/photos/3683054/pexels-photo-3683054.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    qualityScore: 84,
    scores: {
      clinicalDosing: 90,
      thirdPartyTesting: 85,
      brandTransparency: 78,
    },
    aiSummary:
      "This whey protein isolate provides 25g of protein per serving with minimal carbs and fat, making it an excellent option for muscle recovery and growth. The leucine content (approximately 2.5g per serving) is sufficient to stimulate muscle protein synthesis. The product undergoes third-party testing for purity and banned substances, though the testing frequency isn't fully disclosed. While the product contains artificial sweeteners, the overall formulation is backed by substantial research for supporting muscle recovery and growth.",
    ingredients: [
      { name: 'Protein (as Whey Protein Isolate)', dosage: '25g' },
      { name: 'Total Carbohydrates', dosage: '1g' },
      { name: 'Total Fat', dosage: '0.5g' },
      { name: 'Natural and Artificial Flavors', dosage: '' },
    ],
  },
  {
    id: 'DEMO123459',
    name: 'Fish Oil Omega-3',
    brand: 'Nordic Naturals',
    category: 'Fatty Acids',
    imageUrl:
      'https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    qualityScore: 94,
    scores: {
      clinicalDosing: 95,
      thirdPartyTesting: 100,
      brandTransparency: 90,
    },
    aiSummary:
      'This high-quality fish oil supplement provides 1100mg of combined EPA and DHA per serving, which meets clinical recommendations for general health benefits. Nordic Naturals is known for their exceptional purity testing, surpassing international standards for heavy metals and oxidation. The triglyceride form used is more bioavailable than ethyl esters found in some competitors. The company maintains full transparency about sourcing (wild-caught sardines and anchovies) and their manufacturing process is certified sustainable.',
    ingredients: [
      { name: 'Total Omega-3s', dosage: '1600mg' },
      { name: 'EPA (Eicosapentaenoic Acid)', dosage: '650mg' },
      { name: 'DHA (Docosahexaenoic Acid)', dosage: '450mg' },
      { name: 'Other Omega-3s', dosage: '500mg' },
      { name: 'Vitamin E (as d-alpha tocopherol)', dosage: '30 IU' },
    ],
  },
  {
    id: 'DEMO123460',
    name: 'Ashwagandha KSM-66',
    brand: 'Jarrow Formulas',
    category: 'Hormonal Support',
    imageUrl:
      'https://images.pexels.com/photos/3683121/pexels-photo-3683121.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    qualityScore: 89,
    scores: {
      clinicalDosing: 85,
      thirdPartyTesting: 90,
      brandTransparency: 95,
    },
    aiSummary:
      'This supplement uses KSM-66 Ashwagandha, which is a full-spectrum extract with clinical research backing its stress-reducing and hormonal balancing effects. The dose (300mg per capsule) is at the lower end of the clinical range, so two capsules daily would be needed to match most study protocols (600mg). Jarrow Formulas provides extensive information about their quality control processes and sources the patented KSM-66 extract which maintains a standardized withanolide content. The product is free from common allergens and has minimal fillers.',
    ingredients: [
      { name: 'Ashwagandha Extract (KSM-66)', dosage: '300mg' },
      { name: 'Cellulose', dosage: '' },
      { name: 'Magnesium Stearate', dosage: '' },
      { name: 'Silicon Dioxide', dosage: '' },
    ],
  },
];

/**
 * Fetches supplement data from OpenFoodFacts API and analyzes ingredients
 */
export async function getSupplementData(barcode: string): Promise<Supplement> {
  // Return from cache if available
  if (productCache[barcode]) {
    return productCache[barcode];
  }

  // Create a loading state
  const loadingSupplement: Supplement = {
    id: barcode,
    name: 'Loading...',
    brand: '',
    category: '',
    imageUrl: '',
    qualityScore: 0,
    scores: {
      clinicalDosing: 0,
      thirdPartyTesting: 0,
      brandTransparency: 0,
    },
    aiSummary: 'Analyzing product information...',
    ingredients: [],
    isLoading: true,
    error: null,
  };

  // Store loading state in cache
  productCache[barcode] = loadingSupplement;

  try {
    // Fetch product data from OpenFoodFacts
    const product = await fetchProductData(barcode);

    // Create base supplement data
    const supplementData: Supplement = {
      id: barcode,
      name: product.product_name || 'Unknown Product',
      brand: product.brands || 'Unknown Brand',
      category: product.categories?.split(',')[0]?.trim() || 'Supplements',
      imageUrl: product.image_url || 'https://via.placeholder.com/200',
      qualityScore: 0,
      scores: {
        clinicalDosing: 0,
        thirdPartyTesting: 0,
        brandTransparency: 0,
      },
      aiSummary: 'Analyzing ingredients...',
      ingredients: product.ingredients_text
        ? product.ingredients_text.split(',').map((i: string) => ({
            name: i.trim(),
            dosage: '',
          }))
        : [],
      isLoading: false,
      error: null,
      // Store raw data for reference
      product_name: product.product_name,
      brands: product.brands,
      ingredients_text: product.ingredients_text,
      image_url: product.image_url,
      categories: product.categories,
    };

    // If we have ingredients, analyze them
    if (product.ingredients_text && product.ingredients_text.length >= 20) {
      try {
        const analysis = await analyzeIngredients(product.ingredients_text);
        supplementData.qualityScore = analysis.score;
        supplementData.scores = analysis.scores;
        supplementData.aiSummary = analysis.summary;
      } catch (error) {
        console.error('Error analyzing ingredients:', error);
        supplementData.error = 'ingredient_analysis_failed';
      }
    } else if (product.ingredients_text) {
      supplementData.error = 'insufficient_ingredients';
    } else {
      supplementData.error = 'no_ingredients';
    }

    // Update cache with final data
    productCache[barcode] = supplementData;
    return supplementData;
  } catch (error) {
    console.error('Error fetching supplement data:', error);

    // Return error state
    const errorSupplement: Supplement = {
      id: barcode,
      name: 'Product Not Found',
      brand: '',
      category: '',
      imageUrl: 'https://via.placeholder.com/200?text=Product+Not+Found',
      qualityScore: 0,
      scores: {
        clinicalDosing: 0,
        thirdPartyTesting: 0,
        brandTransparency: 0,
      },
      aiSummary:
        'Could not retrieve product information. Please try again or enter the information manually.',
      ingredients: [],
      isLoading: false,
      error: 'product_not_found',
    };

    productCache[barcode] = errorSupplement;
    return errorSupplement;
  }
}

export function searchSupplements(query: string): Supplement[] {
  if (!query) return [];

  // In a real app, you would search your database or API here
  // For now, we'll just return the dummy data filtered by query
  const lowerQuery = query.toLowerCase();
  return dummySupplements.filter(
    (s) =>
      s.name.toLowerCase().includes(lowerQuery) ||
      s.brand.toLowerCase().includes(lowerQuery) ||
      s.category.toLowerCase().includes(lowerQuery),
  );
}

export function getHistoryData(): Supplement[] {
  // This would normally be retrieved from storage
  // For demo, return 3 of the supplements as "history"
  return dummySupplements.slice(0, 3);
}

export function getTopSupplements(category: string): Supplement[] {
  if (category === 'All')
    return dummySupplements.sort((a, b) => b.qualityScore - a.qualityScore);

  return dummySupplements
    .filter((s) => s.category === category || category === 'All')
    .sort((a, b) => b.qualityScore - a.qualityScore);
}
