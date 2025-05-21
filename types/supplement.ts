export interface Ingredient {
  name: string;
  dosage: string;
}

export interface SupplementScores {
  clinicalDosing: number;
  thirdPartyTesting: number;
  brandTransparency: number;
}

export interface Supplement {
  // Core identifiers
  id: string; // barcode/UPC
  code?: string; // For backward compatibility

  // Product information
  name: string;
  brand: string;
  category: string;
  imageUrl: string;

  // Analysis results
  qualityScore: number;
  scores: SupplementScores;
  aiSummary: string;
  ingredients: Ingredient[];

  // UI states
  isLoading?: boolean;
  error?: string | null;

  // Raw data from OpenFoodFacts (optional)
  product_name?: string;
  brands?: string;
  ingredients_text?: string;
  image_url?: string;
  categories?: string;
  nutriscore_grade?: string;
  nova_group?: number;
  ecoscore_grade?: string;
}
